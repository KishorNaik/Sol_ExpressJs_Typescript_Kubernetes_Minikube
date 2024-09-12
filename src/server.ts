import { App } from '@/app';
import { ValidateEnv } from '@/shared/utils/validateEnv';
import { demoModules } from './modules/demo';

ValidateEnv();

const app = new App([...demoModules]);
app.listen();
