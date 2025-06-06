import {
  defineHelper,
  definePartial,
  definePrompt,
  defineTool,
  embed,
  evaluate,
  generate,
  generateStream,
  loadPromptFolder,
  prompt,
  rerank,
  retrieve
} from "@genkit-ai/ai";
import {
  defineEmbedder,
  embedMany
} from "@genkit-ai/ai/embedder";
import {
  defineEvaluator
} from "@genkit-ai/ai/evaluator";
import { configureFormats } from "@genkit-ai/ai/formats";
import {
  defineGenerateAction,
  defineModel
} from "@genkit-ai/ai/model";
import {
  defineReranker
} from "@genkit-ai/ai/reranker";
import {
  defineIndexer,
  defineRetriever,
  defineSimpleRetriever,
  index
} from "@genkit-ai/ai/retriever";
import {
  GenkitError,
  ReflectionServer,
  defineFlow,
  defineJsonSchema,
  defineSchema,
  getContext,
  isDevEnv,
  run
} from "@genkit-ai/core";
import { logger } from "./logging.js";
import { Registry } from "./registry.js";
class Genkit {
  /** Developer-configured options. */
  options;
  /** Registry instance that is exclusively modified by this Genkit instance. */
  registry;
  /** Reflection server for this registry. May be null if not started. */
  reflectionServer = null;
  /** List of flows that have been registered in this instance. */
  flows = [];
  get apiStability() {
    return this.registry.apiStability;
  }
  constructor(options) {
    this.options = options || {};
    this.registry = new Registry();
    this.configure();
    if (isDevEnv() && !disableReflectionApi) {
      this.reflectionServer = new ReflectionServer(this.registry, {
        configuredEnvs: ["dev"]
      });
      this.reflectionServer.start().catch((e) => logger.error);
    }
  }
  /**
   * Defines and registers a flow function.
   */
  defineFlow(config, fn) {
    const flow = defineFlow(this.registry, config, fn);
    this.flows.push(flow);
    return flow;
  }
  /**
   * Defines and registers a tool.
   *
   * Tools can be passed to models by name or value during `generate` calls to be called automatically based on the prompt and situation.
   */
  defineTool(config, fn) {
    return defineTool(this.registry, config, fn);
  }
  /**
   * Defines and registers a schema from a Zod schema.
   *
   * Defined schemas can be referenced by `name` in prompts in place of inline schemas.
   */
  defineSchema(name, schema) {
    return defineSchema(this.registry, name, schema);
  }
  /**
   * Defines and registers a schema from a JSON schema.
   *
   * Defined schemas can be referenced by `name` in prompts in place of inline schemas.
   */
  defineJsonSchema(name, jsonSchema) {
    return defineJsonSchema(this.registry, name, jsonSchema);
  }
  /**
   * Defines a new model and adds it to the registry.
   */
  defineModel(options, runner) {
    return defineModel(this.registry, options, runner);
  }
  /**
   * Looks up a prompt by `name` (and optionally `variant`). Can be used to lookup
   * .prompt files or prompts previously defined with {@link Genkit.definePrompt}
   */
  prompt(name, options) {
    return this.wrapExecutablePromptPromise(
      prompt(this.registry, name, {
        ...options,
        dir: this.options.promptDir ?? "./prompts"
      })
    );
  }
  wrapExecutablePromptPromise(promise) {
    const executablePrompt = async (input, opts) => {
      return (await promise)(input, opts);
    };
    executablePrompt.render = async (opt) => {
      return (await promise).render(opt.input, opt);
    };
    executablePrompt.stream = (input, opts) => {
      return this.generateStream(
        promise.then(
          (action) => action.render(input, {
            ...opts
          })
        )
      );
    };
    executablePrompt.asTool = async () => {
      return (await promise).asTool();
    };
    return executablePrompt;
  }
  /**
   * Defines and registers a prompt based on a function.
   *
   * This is an alternative to defining and importing a .prompt file, providing
   * the most advanced control over how the final request to the model is made.
   *
   * @param options - Prompt metadata including model, model params,
   * input/output schemas, etc
   * @param fn - A function that returns a {@link GenerateRequest}. Any config
   * parameters specified by the {@link GenerateRequest} will take precedence
   * over any parameters specified by `options`.
   *
   * ```ts
   * const hi = ai.definePrompt(
   *   {
   *     name: 'hi',
   *     input: {
   *       schema: z.object({
   *         name: z.string(),
   *       }),
   *     },
   *     config: {
   *       temperature: 1,
   *     },
   *   },
   *   async (input) => {
   *     return {
   *       messages: [ { role: 'user', content: [{ text: `hi ${input.name}` }] } ],
   *     };
   *   }
   * );
   * const { text } = await hi({ name: 'Genkit' });
   * ```
   */
  definePrompt(options, templateOrFn) {
    if (templateOrFn) {
      if (options.messages) {
        throw new GenkitError({
          status: "INVALID_ARGUMENT",
          message: "Cannot specify template/function argument and `options.messages` at the same time"
        });
      }
      if (typeof templateOrFn === "string") {
        return definePrompt(this.registry, {
          ...options,
          messages: templateOrFn
        });
      } else {
        return definePrompt(this.registry, {
          ...options,
          messages: async (input) => {
            const response = await templateOrFn(input);
            return response.messages;
          }
        });
      }
    }
    return definePrompt(this.registry, options);
  }
  /**
   * Creates a retriever action for the provided {@link RetrieverFn} implementation.
   */
  defineRetriever(options, runner) {
    return defineRetriever(this.registry, options, runner);
  }
  /**
   * defineSimpleRetriever makes it easy to map existing data into documents that
   * can be used for prompt augmentation.
   *
   * @param options Configuration options for the retriever.
   * @param handler A function that queries a datastore and returns items from which to extract documents.
   * @returns A Genkit retriever.
   */
  defineSimpleRetriever(options, handler) {
    return defineSimpleRetriever(this.registry, options, handler);
  }
  /**
   * Creates an indexer action for the provided {@link IndexerFn} implementation.
   */
  defineIndexer(options, runner) {
    return defineIndexer(this.registry, options, runner);
  }
  /**
   * Creates evaluator action for the provided {@link EvaluatorFn} implementation.
   */
  defineEvaluator(options, runner) {
    return defineEvaluator(this.registry, options, runner);
  }
  /**
   * Creates embedder model for the provided {@link EmbedderFn} model implementation.
   */
  defineEmbedder(options, runner) {
    return defineEmbedder(this.registry, options, runner);
  }
  /**
   * create a handlebards helper (https://handlebarsjs.com/guide/block-helpers.html) to be used in dotpormpt templates.
   */
  defineHelper(name, fn) {
    defineHelper(this.registry, name, fn);
  }
  /**
   * Creates a handlebars partial (https://handlebarsjs.com/guide/partials.html) to be used in dotpormpt templates.
   */
  definePartial(name, source) {
    definePartial(this.registry, name, source);
  }
  /**
   *  Creates a reranker action for the provided {@link RerankerFn} implementation.
   */
  defineReranker(options, runner) {
    return defineReranker(this.registry, options, runner);
  }
  /**
   * Embeds the given `content` using the specified `embedder`.
   */
  embed(params) {
    return embed(this.registry, params);
  }
  /**
   * A veneer for interacting with embedder models in bulk.
   */
  embedMany(params) {
    return embedMany(this.registry, params);
  }
  /**
   * Evaluates the given `dataset` using the specified `evaluator`.
   */
  evaluate(params) {
    return evaluate(this.registry, params);
  }
  /**
   * Reranks documents from a {@link RerankerArgument} based on the provided query.
   */
  rerank(params) {
    return rerank(this.registry, params);
  }
  /**
   * Indexes `documents` using the provided `indexer`.
   */
  index(params) {
    return index(this.registry, params);
  }
  /**
   * Retrieves documents from the `retriever` based on the provided `query`.
   */
  retrieve(params) {
    return retrieve(this.registry, params);
  }
  async generate(options) {
    let resolvedOptions;
    if (options instanceof Promise) {
      resolvedOptions = await options;
    } else if (typeof options === "string" || Array.isArray(options)) {
      resolvedOptions = {
        prompt: options
      };
    } else {
      resolvedOptions = options;
    }
    return generate(this.registry, resolvedOptions);
  }
  generateStream(options) {
    if (typeof options === "string" || Array.isArray(options)) {
      options = { prompt: options };
    }
    return generateStream(this.registry, options);
  }
  run(name, funcOrInput, maybeFunc) {
    if (maybeFunc) {
      return run(name, funcOrInput, maybeFunc, this.registry);
    }
    return run(name, funcOrInput, this.registry);
  }
  /**
   * Returns current action (or flow) invocation context. Can be used to access things like auth
   * data set by HTTP server frameworks. If invoked outside of an action (e.g. flow or tool) will
   * return `undefined`.
   */
  currentContext() {
    return getContext(this);
  }
  /**
   * Configures the Genkit instance.
   */
  configure() {
    const activeRegistry = this.registry;
    defineGenerateAction(activeRegistry);
    configureFormats(activeRegistry);
    const plugins = [...this.options.plugins ?? []];
    if (this.options.model) {
      this.registry.registerValue(
        "defaultModel",
        "defaultModel",
        this.options.model
      );
    }
    if (this.options.promptDir !== null) {
      loadPromptFolder(
        this.registry,
        this.options.promptDir ?? "./prompts",
        ""
      );
    }
    plugins.forEach((plugin) => {
      const loadedPlugin = plugin(this);
      logger.debug(`Registering plugin ${loadedPlugin.name}...`);
      activeRegistry.registerPluginProvider(loadedPlugin.name, {
        name: loadedPlugin.name,
        async initializer() {
          logger.debug(`Initializing plugin ${loadedPlugin.name}:`);
          await loadedPlugin.initializer();
        }
      });
    });
  }
  /**
   * Stops all servers.
   */
  async stopServers() {
    await this.reflectionServer?.stop();
    this.reflectionServer = null;
  }
}
function genkit(options) {
  return new Genkit(options);
}
const shutdown = async () => {
  logger.info("Shutting down all Genkit servers...");
  await ReflectionServer.stopAll();
  process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
let disableReflectionApi = false;
function __disableReflectionApi() {
  disableReflectionApi = true;
}
export {
  Genkit,
  __disableReflectionApi,
  genkit
};
//# sourceMappingURL=genkit.mjs.map