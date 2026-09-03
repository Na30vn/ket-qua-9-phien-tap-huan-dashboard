/**
 * Chạy một lần hàm hoanThienThongTinNguoiThamGia9Form().
 *
 * Script sẽ:
 * - bảo đảm đủ "Họ và tên", "Đơn vị công tác" và
 *   "Chức vụ/Vị trí công tác" trên cả 09 Form;
 * - đặt mọi câu hỏi có thể trả lời là bắt buộc và các trường thông tin là 0 điểm;
 * - không tạo trùng nếu chạy lại;
 * - không xoá hoặc sửa các câu hỏi hiện có.
 */
const PARTICIPANT_FORM_IDS = {
  4: '1nRp8sFbzi-z-sJtWbfkC26h2TbBpVl6zN2d997KaRvU',
  5: '1RQ5AjKgzUPkGXDay8N9rmLmyz7ObbFp0rNMqFVwnhE4',
  6: '1NAGUw2Eebr2DkoobCXHn-e0bNJmzIfjQoWLr4VjdllU',
  7: '1iGTpKxlI_ksXtUoKv0Ir3toXRUs0O9_sRVXSfspG5zw',
  8: '1q2-8J9OxKcAHIBz6CWpQGTVyXxEuaqMzELhoWf7-LWk',
  9: '1w65HrpYrgI9RX2iYEu7jz57ka0TIG-CCJzJ8rcPBZ-4'
};

const PARTICIPANT_FORM_TARGETS = {
  1: { id: '1Y-hWQ48BD7oY5fPDXXQOBSZYq2tCoVTG3CUv2swJirk' },
  2: { id: '1FUPYBBfxv_4hHHC8RuyatvgmJXhM6bcZz98wElmn6Q4' },
  3: { id: '107cKSnhSdvMStJPiqi5lTW9jg1Va5LkfgtgUfzMIe1I' },
  4: { id: PARTICIPANT_FORM_IDS[4] },
  5: { id: PARTICIPANT_FORM_IDS[5] },
  6: { id: PARTICIPANT_FORM_IDS[6] },
  7: { id: PARTICIPANT_FORM_IDS[7] },
  8: { id: PARTICIPANT_FORM_IDS[8] },
  9: { id: PARTICIPANT_FORM_IDS[9] }
};

const ACTIVE_UNIT_OPTIONS = [
  'Sở Tài chính',
  'Phường Hải Châu',
  'Phường Hòa Cường',
  'Phường Thanh Khê',
  'Phường An Khê',
  'Phường An Hải',
  'Phường Sơn Trà',
  'Phường Ngũ Hành Sơn',
  'Phường Hòa Khánh',
  'Phường Liên Chiểu',
  'Phường Hải Vân',
  'Phường Tam Kỳ',
  'Phường Quảng Phú',
  'Phường Hương Trà',
  'Phường Bàn Thạch',
  'Phường Điện Bàn',
  'Phường Điện Bàn Đông',
  'Phường An Thắng',
  'Phường Điện Bàn Bắc',
  'Phường Hội An',
  'Phường Hội An Đông',
  'Phường Hội An Tây',
  'Xã Hòa Vang',
  'Xã Hòa Tiến',
  'Xã Bà Nà',
  'Xã Tam Anh',
  'Xã Tam Xuân',
  'Xã Tây Hồ',
  'Xã Chiên Đàn',
  'Xã Tiên Phước',
  'Xã Thạnh Bình',
  'Xã Sơn Cẩm Hà',
  'Xã Trà Liên',
  'Xã Trà Đốc',
  'Xã Trà Giáp',
  'Xã Trà Tân',
  'Xã Trà My',
  'Xã Nam Trà My',
  'Xã Trà Tập',
  'Xã Trà Vân',
  'Xã Trà Leng',
  'Xã Thăng Bình',
  'Xã Thăng Điền',
  'Xã Thăng An',
  'Xã Thăng Trường',
  'Xã Thăng Phú',
  'Xã Đồng Dương',
  'Xã Quế Sơn Trung',
  'Xã Xuân Phú',
  'Xã Nông Sơn',
  'Xã Quế Phước',
  'Xã Duy Nghĩa',
  'Xã Nam Phước',
  'Xã Duy Xuyên',
  'Xã Thu Bồn',
  'Xã Điện Bàn Tây',
  'Xã Gò Nổi',
  'Xã Tân Hiệp',
  'Xã Đại Lộc',
  'Xã Hà Nha',
  'Xã Thượng Đức',
  'Xã Vu Gia',
  'Xã Phú Thuận',
  'Xã Thạnh Mỹ',
  'Xã Bến Giằng',
  'Xã Nam Giang',
  'Xã Đắc Pring',
  'Xã La Dêê',
  'Xã La Êê',
  'Xã Sông Vàng',
  'Xã Sông Kôn',
  'Xã Đông Giang',
  'Xã Avương',
  'Xã Tây Giang',
  'Xã Hiệp Đức',
  'Xã Việt An',
  'Xã Phước Trà',
  'Xã Khâm Đức',
  'Xã Phước Năng',
  'Xã Phước Chánh',
  'Xã Phước Thành',
  'Xã Phước Hiệp',
  'Xã Lãnh Ngọc'
];

const PARTICIPANT_POSITION_TITLE = 'Chức vụ/Vị trí công tác';

/**
 * Hoàn thiện thông tin người tham gia và Required cho cả 09 Form.
 * Hàm có thể chạy lại an toàn: nhận diện trường theo tiêu đề đã chuẩn hóa,
 * không tạo trùng và không thay đổi nội dung câu hỏi nghiệp vụ.
 */
function hoanThienThongTinNguoiThamGia9Form() {
  const report = [];
  Object.keys(PARTICIPANT_FORM_TARGETS).forEach(sessionNumber => {
    try {
      const form = openParticipantForm_(PARTICIPANT_FORM_TARGETS[sessionNumber]);
      let nameItem = form.getItems().find(item => isNameTitle_(item.getTitle())) || null;
      if (!nameItem) nameItem = form.addTextItem().setTitle('Họ và tên');
      let unitItem = form.getItems().find(item => isUnitTitle_(item.getTitle())) || null;
      if (!unitItem) unitItem = form.addListItem().setTitle('Đơn vị công tác');
      let positionItem = form.getItems().find(item => isPositionTitle_(item.getTitle())) || null;
      if (!positionItem) positionItem = form.addTextItem().setTitle(PARTICIPANT_POSITION_TITLE);

      setFormItemRequired_(nameItem, true);
      setFormItemRequired_(unitItem, true);
      setFormItemRequired_(positionItem, true);
      setZeroQuizPoints_(form, [nameItem, unitItem, positionItem]);

      moveFormItemTo_(form, nameItem, 0);
      moveFormItemTo_(form, unitItem, 1);
      moveFormItemTo_(form, positionItem, 2);

      let requiredQuestions = 0;
      form.getItems().forEach(item => {
        if (setFormItemRequired_(item, true)) requiredQuestions += 1;
      });

      report.push({
        phien: Number(sessionNumber),
        ok: true,
        form: form.getTitle(),
        tongMuc: form.getItems().length,
        soCauBatBuoc: requiredQuestions,
        thongTinNguoiThamGia: ['Họ và tên', 'Đơn vị công tác', PARTICIPANT_POSITION_TITLE]
      });
    } catch (error) {
      report.push({ phien: Number(sessionNumber), ok: false, loi: String(error.message || error) });
    }
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

/** Chỉ đọc hiện trạng, dùng để đối chiếu trước/sau khi chạy hàm hoàn thiện. */
function kiemTraThongTinVaCauBatBuoc9Form() {
  const report = Object.keys(PARTICIPANT_FORM_TARGETS).map(sessionNumber => {
    try {
      const form = openParticipantForm_(PARTICIPANT_FORM_TARGETS[sessionNumber]);
      const items = form.getItems();
      const answerable = items.filter(item => isAnswerableFormItem_(item));
      return {
        phien: Number(sessionNumber),
        ok: true,
        form: form.getTitle(),
        hoTen: items.filter(item => isNameTitle_(item.getTitle())).map(describeFormItem_),
        donVi: items.filter(item => isUnitTitle_(item.getTitle())).map(describeFormItem_),
        chucVu: items.filter(item => isPositionTitle_(item.getTitle())).map(describeFormItem_),
        cauCoTheTraLoi: answerable.length,
        cauChuaBatBuoc: answerable.filter(item => !isFormItemRequired_(item)).map(item => ({
          viTri: item.getIndex() + 1,
          tieuDe: item.getTitle(),
          loai: item.getType().toString()
        }))
      };
    } catch (error) {
      return { phien: Number(sessionNumber), ok: false, loi: String(error.message || error) };
    }
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

function themThongTinNguoiLamChoPhien4Den9() {
  const report = [];
  Object.keys(PARTICIPANT_FORM_IDS).forEach(sessionNumber => {
    const form = FormApp.openById(PARTICIPANT_FORM_IDS[sessionNumber]);
    const nameItem = findOrCreateTextItem_(form, 'Họ và tên', isNameTitle_);
    const unitItem = findOrCreateTextItem_(form, 'Đơn vị công tác', isUnitTitle_);

    nameItem.setRequired(true);
    unitItem.setRequired(true);
    if (form.isQuiz()) {
      nameItem.setPoints(0);
      unitItem.setPoints(0);
    }

    // Đưa hai trường lên đầu biểu mẫu theo đúng thứ tự.
    form.moveItem(nameItem, 0);
    form.moveItem(unitItem, 1);

    report.push({
      phien: Number(sessionNumber),
      form: form.getTitle(),
      tongCauHoi: form.getItems().length,
      trangThai: 'Đã có Họ và tên + Đơn vị công tác'
    });
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

/**
 * Chạy hàm này để:
 * - tạo/cập nhật tab DM_DON_VI trong KET_QUA_9_PHIEN_TAP_HUAN;
 * - thay trường Đơn vị công tác bằng dropdown trên cả 9 Form;
 * - chỉ dùng các đơn vị thực tế có học viên trong danh sách tài khoản.
 */
function dongBoDropdownDonViCho9Phien() {
  const units = updateUnitCatalog_();
  const report = [];
  Object.keys(PARTICIPANT_FORM_TARGETS).forEach(sessionNumber => {
    try {
      const form = openParticipantForm_(PARTICIPANT_FORM_TARGETS[sessionNumber]);
      const listItem = replaceUnitItemsWithDropdown_(form, units);
      report.push({
        phien: Number(sessionNumber),
        ok: true,
        form: form.getTitle(),
        soDonVi: listItem.getChoices().length,
        loaiTruong: listItem.getType().toString(),
        batBuoc: listItem.isRequired()
      });
    } catch (error) {
      report.push({
        phien: Number(sessionNumber),
        ok: false,
        loi: String(error.message || error)
      });
    }
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

/**
 * Báo cáo hiện trạng trường đơn vị trên 9 Form, không sửa dữ liệu.
 */
function kiemTraTruongDonVi9Form() {
  const report = Object.keys(PARTICIPANT_FORM_TARGETS).map(sessionNumber => {
    try {
      const form = openParticipantForm_(PARTICIPANT_FORM_TARGETS[sessionNumber]);
      const items = form.getItems();
      return {
        phien: Number(sessionNumber),
        form: form.getTitle(),
        tongCauHoi: items.length,
        hoTen: items.filter(item => isNameTitle_(item.getTitle())).map(describeFormItem_),
        donVi: items.filter(item => isUnitTitle_(item.getTitle())).map(describeFormItem_)
      };
    } catch (error) {
      return { phien: Number(sessionNumber), loi: String(error.message || error) };
    }
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

/**
 * Kiểm tra quyền mở 9 Form trước khi đồng bộ, không sửa dữ liệu.
 */
function kiemTraQuyenMo9Form() {
  const report = Object.keys(PARTICIPANT_FORM_TARGETS).map(sessionNumber => {
    try {
      const form = openParticipantForm_(PARTICIPANT_FORM_TARGETS[sessionNumber]);
      return { phien: Number(sessionNumber), ok: true, form: form.getTitle() };
    } catch (error) {
      return { phien: Number(sessionNumber), ok: false, loi: String(error.message || error) };
    }
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

function yeuCauCapQuyenForm() {
  return FormApp.openById(PARTICIPANT_FORM_IDS[4]).getTitle();
}

function timFormUrlTuTabPhien1Den3() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const report = [1, 2, 3].map(sessionNumber => {
    const sheet = spreadsheet.getSheetByName('Phiên ' + sessionNumber);
    return {
      phien: sessionNumber,
      formUrl: sheet && typeof sheet.getFormUrl === 'function' ? sheet.getFormUrl() : null
    };
  });
  console.log(JSON.stringify(report, null, 2));
  return report;
}

function updateUnitCatalog_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Chưa cấu hình Script Property SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName('DM_DON_VI') || spreadsheet.insertSheet('DM_DON_VI');
  sheet.clearContents();
  sheet.getRange(1, 1, ACTIVE_UNIT_OPTIONS.length + 1, 1)
    .setValues([['Đơn vị công tác']].concat(ACTIVE_UNIT_OPTIONS.map(unit => [unit])));
  sheet.setFrozenRows(1);
  sheet.autoResizeColumn(1);
  return ACTIVE_UNIT_OPTIONS.slice();
}

function openParticipantForm_(target) {
  if (target.id) return FormApp.openById(target.id);
  if (target.url) return FormApp.openByUrl(target.url);
  throw new Error('Thiếu ID hoặc URL của Form');
}

function replaceUnitItemsWithDropdown_(form, units) {
  const cleanedUnits = Array.from(new Set(units.map(unit => String(unit || '').trim())))
    .filter(Boolean);
  if (!cleanedUnits.length || cleanedUnits.length !== units.length) {
    throw new Error('Danh mục đơn vị có dòng trống hoặc trùng');
  }

  const unitItems = form.getItems().filter(item => isUnitTitle_(item.getTitle()));
  let listItem = unitItems
    .filter(item => item.getType() === FormApp.ItemType.LIST)
    .map(item => item.asListItem())[0] || null;
  if (!listItem) listItem = form.addListItem().setTitle('Đơn vị công tác');

  try {
    listItem.setChoices(cleanedUnits.map(unit => listItem.createChoice(unit)));
    listItem.setRequired(true);
  } catch (error) {
    throw new Error(
      'Không thể cập nhật ' + cleanedUnits.length + ' lựa chọn cho Form ' +
      form.getId() + ': ' + String(error.message || error)
    );
  }
  const nameItem = form.getItems().find(item => isNameTitle_(item.getTitle()));
  const targetIndex = Math.min(
    nameItem ? nameItem.getIndex() + 1 : 0,
    form.getItems().length - 1
  );
  if (listItem.getIndex() !== targetIndex) {
    form.moveItem(listItem.getIndex(), targetIndex);
  }

  // Chỉ xoá các trường đơn vị cũ sau khi dropdown mới đã cấu hình thành công.
  form.getItems().filter(item =>
    isUnitTitle_(item.getTitle()) && item.getId() !== listItem.getId()
  ).slice().reverse().forEach(item => form.deleteItem(item));
  return listItem;
}

function describeFormItem_(item) {
  const result = {
    viTri: item.getIndex() + 1,
    id: item.getId(),
    tieuDe: item.getTitle(),
    loai: item.getType().toString()
  };
  if (item.getType() === FormApp.ItemType.LIST) result.soLuaChon = item.asListItem().getChoices().length;
  if (isAnswerableFormItem_(item)) result.batBuoc = isFormItemRequired_(item);
  return result;
}

function moveFormItemTo_(form, item, targetIndex) {
  if (item.getIndex() !== targetIndex) form.moveItem(item.getIndex(), targetIndex);
}

function setZeroQuizPoints_(form, items) {
  if (!form.isQuiz()) return;
  items.forEach(item => {
    const typed = asAnswerableFormItem_(item);
    if (typed && typeof typed.setPoints === 'function') typed.setPoints(0);
  });
}

function setFormItemRequired_(item, required) {
  const typed = asAnswerableFormItem_(item);
  if (!typed || typeof typed.setRequired !== 'function') return false;
  typed.setRequired(required);
  return true;
}

function isFormItemRequired_(item) {
  const typed = asAnswerableFormItem_(item);
  return Boolean(typed && typeof typed.isRequired === 'function' && typed.isRequired());
}

function isAnswerableFormItem_(item) {
  return Boolean(asAnswerableFormItem_(item));
}

function asAnswerableFormItem_(item) {
  const type = item.getType();
  const converters = {};
  converters[FormApp.ItemType.TEXT] = 'asTextItem';
  converters[FormApp.ItemType.PARAGRAPH_TEXT] = 'asParagraphTextItem';
  converters[FormApp.ItemType.MULTIPLE_CHOICE] = 'asMultipleChoiceItem';
  converters[FormApp.ItemType.CHECKBOX] = 'asCheckboxItem';
  converters[FormApp.ItemType.LIST] = 'asListItem';
  converters[FormApp.ItemType.SCALE] = 'asScaleItem';
  converters[FormApp.ItemType.GRID] = 'asGridItem';
  converters[FormApp.ItemType.CHECKBOX_GRID] = 'asCheckboxGridItem';
  converters[FormApp.ItemType.DATE] = 'asDateItem';
  converters[FormApp.ItemType.DATETIME] = 'asDateTimeItem';
  converters[FormApp.ItemType.TIME] = 'asTimeItem';
  converters[FormApp.ItemType.DURATION] = 'asDurationItem';
  if (FormApp.ItemType.FILE_UPLOAD) converters[FormApp.ItemType.FILE_UPLOAD] = 'asFileUploadItem';
  const converter = converters[type];
  return converter && typeof item[converter] === 'function' ? item[converter]() : null;
}

function findOrCreateTextItem_(form, title, matcher) {
  const existing = form.getItems(FormApp.ItemType.TEXT)
    .map(item => item.asTextItem())
    .find(item => matcher(item.getTitle()));
  return existing || form.addTextItem().setTitle(title);
}

function isNameTitle_(title) {
  const value = normalizeParticipantTitle_(title);
  return value === 'ho va ten' || value.indexOf('ho va ten ') === 0;
}

function isUnitTitle_(title) {
  const value = normalizeParticipantTitle_(title);
  return value === 'don vi' || value === 'don vi cong tac' ||
    (value.indexOf('don vi ') === 0 && value.indexOf('cong tac') !== -1);
}

function isPositionTitle_(title) {
  const value = normalizeParticipantTitle_(title);
  return value === 'chuc vu' || value === 'vi tri cong tac' ||
    value === 'chuc vu vi tri cong tac' ||
    (value.indexOf('chuc vu') !== -1 && value.indexOf('vi tri') !== -1);
}

function normalizeParticipantTitle_(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Đđ]/g, 'd')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}
