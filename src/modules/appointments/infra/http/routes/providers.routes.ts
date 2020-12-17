import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
    '/:provider_id/mes-disponivel',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerMonthAvailabilityController.index,
);
providersRouter.get(
    '/:provider_id/dia-disponivel',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerDayAvailabilityController.index,
);

export default providersRouter;
