/**
 * Chạy một lần hàm themThongTinNguoiLamChoPhien4Den9().
 *
 * Script sẽ:
 * - thêm "Họ và tên" và "Đơn vị công tác" vào đầu Form 4–9;
 * - đặt hai trường là bắt buộc và 0 điểm;
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

function normalizeParticipantTitle_(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Đđ]/g, 'd')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}
