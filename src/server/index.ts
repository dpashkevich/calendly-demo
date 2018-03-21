import {CalendlyServerApp} from './CalendlyServerApp';

const PORT: number = parseInt(process.env.PORT || '', 10) || 5000;

new CalendlyServerApp(PORT).initServer();
