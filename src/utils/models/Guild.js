const { model, Schema } = require('mongoose')

const Guild = new Schema({
  _id: { type: String, required: true },
  vch: { type: String, default: '0' },
  tch: { type: String, default: '0' },
  category1: { type: String, default: '0' },
  category2: { type: String, default: '0' }
}, { collection: 'guild', versionKey: false })

module.exports = {
  modelName: 'guild',
  getModel: model('guild', Guild)
}
