import { sendMessage } from '../components/react-dev-overlay/pages/websocket';
export default function reportToSocket(span) {
    if (span.state.state !== 'ended') {
        throw Object.defineProperty(new Error('Expected span to be ended'), "__NEXT_ERROR_CODE", {
            value: "E302",
            enumerable: false,
            configurable: true
        });
    }
    sendMessage(JSON.stringify({
        event: 'span-end',
        startTime: span.startTime,
        endTime: span.state.endTime,
        spanName: span.name,
        attributes: span.attributes
    }));
}

//# sourceMappingURL=report-to-socket.js.map