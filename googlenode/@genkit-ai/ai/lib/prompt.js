"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var prompt_exports = {};
__export(prompt_exports, {
  defineHelper: () => defineHelper,
  definePartial: () => definePartial,
  definePrompt: () => definePrompt,
  isExecutablePrompt: () => isExecutablePrompt,
  isPromptAction: () => isPromptAction,
  loadPromptFolder: () => loadPromptFolder,
  loadPromptFolderRecursively: () => loadPromptFolderRecursively,
  prompt: () => prompt
});
module.exports = __toCommonJS(prompt_exports);
var import_core = require("@genkit-ai/core");
var import_async = require("@genkit-ai/core/async");
var import_logging = require("@genkit-ai/core/logging");
var import_schema = require("@genkit-ai/core/schema");
var import_fs = require("fs");
var import_path = require("path");
var import_generate = require("./generate.js");
var import_message = require("./message.js");
var import_session = require("./session.js");
function isPromptAction(action) {
  return action.__action.metadata?.type === "prompt";
}
function definePrompt(registry, options) {
  return definePromptAsync(
    registry,
    `${options.name}${options.variant ? `.${options.variant}` : ""}`,
    Promise.resolve(options)
  );
}
function definePromptAsync(registry, name, optionsPromise) {
  const promptCache = {};
  const renderOptionsFn = async (input, renderOptions) => {
    const messages = [];
    renderOptions = { ...renderOptions };
    const session = (0, import_session.getCurrentSession)(registry);
    const resolvedOptions = await optionsPromise;
    await renderSystemPrompt(
      registry,
      session,
      input,
      messages,
      resolvedOptions,
      promptCache,
      renderOptions
    );
    await renderMessages(
      registry,
      session,
      input,
      messages,
      resolvedOptions,
      renderOptions,
      promptCache
    );
    await renderUserPrompt(
      registry,
      session,
      input,
      messages,
      resolvedOptions,
      promptCache,
      renderOptions
    );
    let docs;
    if (typeof resolvedOptions.docs === "function") {
      docs = await resolvedOptions.docs(input, {
        state: session?.state,
        context: renderOptions?.context || (0, import_core.getContext)(registry) || {}
      });
    } else {
      docs = resolvedOptions.docs;
    }
    const opts = (0, import_core.stripUndefinedProps)({
      model: resolvedOptions.model,
      maxTurns: resolvedOptions.maxTurns,
      messages,
      docs,
      tools: resolvedOptions.tools,
      returnToolRequests: resolvedOptions.returnToolRequests,
      toolChoice: resolvedOptions.toolChoice,
      context: resolvedOptions.context,
      output: resolvedOptions.output,
      use: resolvedOptions.use,
      ...(0, import_core.stripUndefinedProps)(renderOptions),
      config: {
        ...resolvedOptions?.config,
        ...renderOptions?.config
      }
    });
    if (Object.keys(opts.config).length === 0 && !renderOptions?.config) {
      delete opts.config;
    }
    return opts;
  };
  const rendererActionConfig = (0, import_async.lazy)(
    () => optionsPromise.then((options) => {
      const metadata = promptMetadata(options);
      return {
        name: `${options.name}${options.variant ? `.${options.variant}` : ""}`,
        inputJsonSchema: options.input?.jsonSchema,
        inputSchema: options.input?.schema,
        description: options.description,
        actionType: "prompt",
        metadata,
        fn: async (input) => {
          return (0, import_generate.toGenerateRequest)(
            registry,
            await renderOptionsFn(input, void 0)
          );
        }
      };
    })
  );
  const rendererAction = (0, import_core.defineActionAsync)(
    registry,
    "prompt",
    name,
    rendererActionConfig,
    (action) => {
      action.__executablePrompt = executablePrompt;
    }
  );
  const executablePromptActionConfig = (0, import_async.lazy)(
    () => optionsPromise.then((options) => {
      const metadata = promptMetadata(options);
      return {
        name: `${options.name}${options.variant ? `.${options.variant}` : ""}`,
        inputJsonSchema: options.input?.jsonSchema,
        inputSchema: options.input?.schema,
        description: options.description,
        actionType: "executable-prompt",
        metadata,
        fn: async (input, { sendChunk }) => {
          return await (0, import_generate.generate)(registry, {
            ...await renderOptionsFn(input, void 0),
            onChunk: sendChunk
          });
        }
      };
    })
  );
  (0, import_core.defineActionAsync)(
    registry,
    "executable-prompt",
    name,
    executablePromptActionConfig,
    (action) => {
      action.__executablePrompt = executablePrompt;
    }
  );
  const executablePrompt = wrapInExecutablePrompt(
    registry,
    renderOptionsFn,
    rendererAction
  );
  return executablePrompt;
}
function promptMetadata(options) {
  const metadata = {
    ...options.metadata,
    prompt: {
      ...options.metadata?.prompt,
      config: options.config,
      input: {
        schema: options.input ? (0, import_schema.toJsonSchema)(options.input) : void 0
      },
      name: options.name.includes(".") ? options.name.split(".")[0] : options.name,
      model: modelName(options.model)
    },
    type: "prompt"
  };
  if (options.variant) {
    metadata.prompt.variant = options.variant;
  }
  return metadata;
}
function wrapInExecutablePrompt(registry, renderOptionsFn, rendererAction) {
  const executablePrompt = async (input, opts) => {
    return (0, import_generate.generate)(registry, {
      ...await renderOptionsFn(input, opts)
    });
  };
  executablePrompt.render = async (input, opts) => {
    return {
      ...await renderOptionsFn(input, opts)
    };
  };
  executablePrompt.stream = (input, opts) => {
    return (0, import_generate.generateStream)(registry, renderOptionsFn(input, opts));
  };
  executablePrompt.asTool = async () => {
    return await rendererAction;
  };
  return executablePrompt;
}
async function renderSystemPrompt(registry, session, input, messages, options, promptCache, renderOptions) {
  if (typeof options.system === "function") {
    messages.push({
      role: "system",
      content: normalizeParts(
        await options.system(input, {
          state: session?.state,
          context: renderOptions?.context || (0, import_core.getContext)(registry) || {}
        })
      )
    });
  } else if (typeof options.system === "string") {
    if (!promptCache.system) {
      promptCache.system = await registry.dotprompt.compile(options.system);
    }
    messages.push({
      role: "system",
      content: await renderDotpromptToParts(
        registry,
        promptCache.system,
        input,
        session,
        options,
        renderOptions
      )
    });
  } else if (options.system) {
    messages.push({
      role: "system",
      content: normalizeParts(options.system)
    });
  }
}
async function renderMessages(registry, session, input, messages, options, renderOptions, promptCache) {
  if (options.messages) {
    if (typeof options.messages === "function") {
      messages.push(
        ...await options.messages(input, {
          state: session?.state,
          context: renderOptions?.context || (0, import_core.getContext)(registry) || {},
          history: renderOptions?.messages
        })
      );
    } else if (typeof options.messages === "string") {
      if (!promptCache.messages) {
        promptCache.messages = await registry.dotprompt.compile(
          options.messages
        );
      }
      const rendered = await promptCache.messages({
        input,
        context: {
          ...renderOptions?.context || (0, import_core.getContext)(registry),
          state: session?.state
        },
        messages: renderOptions?.messages?.map(
          (m) => import_message.Message.parseData(m)
        )
      });
      messages.push(...rendered.messages);
    } else {
      messages.push(...options.messages);
    }
  } else {
    if (renderOptions.messages) {
      messages.push(...renderOptions.messages);
    }
  }
  if (renderOptions?.messages) {
    delete renderOptions.messages;
  }
}
async function renderUserPrompt(registry, session, input, messages, options, promptCache, renderOptions) {
  if (typeof options.prompt === "function") {
    messages.push({
      role: "user",
      content: normalizeParts(
        await options.prompt(input, {
          state: session?.state,
          context: renderOptions?.context || (0, import_core.getContext)(registry) || {}
        })
      )
    });
  } else if (typeof options.prompt === "string") {
    if (!promptCache.userPrompt) {
      promptCache.userPrompt = await registry.dotprompt.compile(options.prompt);
    }
    messages.push({
      role: "user",
      content: await renderDotpromptToParts(
        registry,
        promptCache.userPrompt,
        input,
        session,
        options,
        renderOptions
      )
    });
  } else if (options.prompt) {
    messages.push({
      role: "user",
      content: normalizeParts(options.prompt)
    });
  }
}
function modelName(modelArg) {
  if (modelArg === void 0) {
    return void 0;
  }
  if (typeof modelArg === "string") {
    return modelArg;
  }
  if (modelArg.name) {
    return modelArg.name;
  }
  return modelArg.__action.name;
}
function normalizeParts(parts) {
  if (Array.isArray(parts)) return parts;
  if (typeof parts === "string") {
    return [
      {
        text: parts
      }
    ];
  }
  return [parts];
}
async function renderDotpromptToParts(registry, promptFn, input, session, options, renderOptions) {
  const renderred = await promptFn({
    input,
    context: {
      ...renderOptions?.context || (0, import_core.getContext)(registry),
      state: session?.state
    }
  });
  if (renderred.messages.length !== 1) {
    throw new Error("parts tempate must produce only one message");
  }
  return renderred.messages[0].content;
}
function isExecutablePrompt(obj) {
  return !!obj?.render && !!obj?.asTool && !!obj?.stream;
}
function loadPromptFolder(registry, dir = "./prompts", ns) {
  const promptsPath = (0, import_path.resolve)(dir);
  if ((0, import_fs.existsSync)(promptsPath)) {
    loadPromptFolderRecursively(registry, dir, ns, "");
  }
}
function loadPromptFolderRecursively(registry, dir, ns, subDir) {
  const promptsPath = (0, import_path.resolve)(dir);
  const dirEnts = (0, import_fs.readdirSync)((0, import_path.join)(promptsPath, subDir), {
    withFileTypes: true
  });
  for (const dirEnt of dirEnts) {
    const parentPath = (0, import_path.join)(promptsPath, subDir);
    let fileName = dirEnt.name;
    if (dirEnt.isFile() && fileName.endsWith(".prompt")) {
      if (fileName.startsWith("_")) {
        const partialName = fileName.substring(1, fileName.length - 7);
        definePartial(
          registry,
          partialName,
          (0, import_fs.readFileSync)((0, import_path.join)(parentPath, fileName), {
            encoding: "utf8"
          })
        );
        import_logging.logger.debug(
          `Registered Dotprompt partial "${partialName}" from "${(0, import_path.join)(parentPath, fileName)}"`
        );
      } else {
        loadPrompt(
          registry,
          promptsPath,
          fileName,
          subDir ? `${subDir}/` : "",
          ns
        );
      }
    } else if (dirEnt.isDirectory()) {
      loadPromptFolderRecursively(registry, dir, ns, (0, import_path.join)(subDir, fileName));
    }
  }
}
function definePartial(registry, name, source) {
  registry.dotprompt.definePartial(name, source);
}
function defineHelper(registry, name, fn) {
  registry.dotprompt.defineHelper(name, fn);
}
function loadPrompt(registry, path, filename, prefix = "", ns = "dotprompt") {
  let name = `${prefix ?? ""}${(0, import_path.basename)(filename, ".prompt")}`;
  let variant = null;
  if (name.includes(".")) {
    const parts = name.split(".");
    name = parts[0];
    variant = parts[1];
  }
  const source = (0, import_fs.readFileSync)((0, import_path.join)(path, prefix ?? "", filename), "utf8");
  const parsedPrompt = registry.dotprompt.parse(source);
  definePromptAsync(
    registry,
    registryDefinitionKey(name, variant ?? void 0, ns),
    // We use a lazy promise here because we only want prompt loaded when it's first used.
    // This is important because otherwise the loading may happen before the user has configured
    // all the schemas, etc., which will result in dotprompt.renderMetadata errors.
    (0, import_async.lazy)(async () => {
      const promptMetadata2 = await registry.dotprompt.renderMetadata(parsedPrompt);
      if (variant) {
        promptMetadata2.variant = variant;
      }
      if (promptMetadata2.output?.schema?.description === null) {
        delete promptMetadata2.output.schema.description;
      }
      if (promptMetadata2.input?.schema?.description === null) {
        delete promptMetadata2.input.schema.description;
      }
      return {
        name: registryDefinitionKey(name, variant ?? void 0, ns),
        model: promptMetadata2.model,
        config: promptMetadata2.config,
        tools: promptMetadata2.tools,
        description: promptMetadata2.description,
        output: {
          jsonSchema: promptMetadata2.output?.schema,
          format: promptMetadata2.output?.format
        },
        input: {
          jsonSchema: promptMetadata2.input?.schema
        },
        metadata: {
          ...promptMetadata2.metadata,
          type: "prompt",
          prompt: {
            ...promptMetadata2,
            template: parsedPrompt.template
          }
        },
        maxTurns: promptMetadata2.raw?.["maxTurns"],
        toolChoice: promptMetadata2.raw?.["toolChoice"],
        returnToolRequests: promptMetadata2.raw?.["returnToolRequests"],
        messages: parsedPrompt.template
      };
    })
  );
}
async function prompt(registry, name, options) {
  return await lookupPrompt(
    registry,
    name,
    options?.variant
  );
}
function registryLookupKey(name, variant, ns) {
  return `/prompt/${registryDefinitionKey(name, variant, ns)}`;
}
async function lookupPrompt(registry, name, variant) {
  let registryPrompt = await registry.lookupAction(
    registryLookupKey(name, variant)
  );
  if (registryPrompt) {
    return registryPrompt.__executablePrompt;
  }
  throw new import_core.GenkitError({
    status: "NOT_FOUND",
    message: `Prompt ${name + (variant ? ` (variant ${variant})` : "")} not found`
  });
}
function registryDefinitionKey(name, variant, ns) {
  return `${ns ? `${ns}/` : ""}${name}${variant ? `.${variant}` : ""}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineHelper,
  definePartial,
  definePrompt,
  isExecutablePrompt,
  isPromptAction,
  loadPromptFolder,
  loadPromptFolderRecursively,
  prompt
});
//# sourceMappingURL=prompt.js.map