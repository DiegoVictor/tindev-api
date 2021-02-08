import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    liked_user_id: Joi.string().required(),
  }),
});
