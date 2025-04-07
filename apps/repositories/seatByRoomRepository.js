const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');

exports.getAll = () => {
  return ChiTietPhongChieu.find()
    .populate('phong')
    .populate('ghe');
};

exports.getByRoomId = (roomId) => {
  return ChiTietPhongChieu.find({ phong: roomId })
    .populate('phong')
    .populate('ghe');
};

exports.create = (data) => {
  const newDetail = new ChiTietPhongChieu(data);
  return newDetail.save();
};

exports.updateStatus = (id, status) => {
  return ChiTietPhongChieu.findByIdAndUpdate(id, { trangThai: status }, { new: true });
};
