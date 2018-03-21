import {CalendlyWebhookBody} from '../common/model/CalendlyWebhookBody';

type CalendlyWebhookListener = (b: CalendlyWebhookBody) => void;
/**
 * Client-side app to manage Calendly events
 */
export class CalendlyEventApp {
  public events: CalendlyWebhookBody[] = [];
  private eventListeners: CalendlyWebhookListener[] = [];
  constructor(private io: SocketIOClient.Socket) {
    this.bindListeners();
  }

  public onNewEvent(cb: CalendlyWebhookListener) {
    this.eventListeners.push(cb);
  }

  private bindListeners() {
    this.io.on('new event', (msg: string) => {
      const eventData: CalendlyWebhookBody = JSON.parse(msg) as CalendlyWebhookBody;
      this.events.push(eventData);
      this.eventListeners.forEach((cb) => cb(eventData));
    });
  }
}
