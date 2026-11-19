import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FranchiseInput, validateFranchiseForm } from '../utils/storeLogic';
import { submitInquiry } from '../utils/apiClient';
import { ArtisanImage } from './ArtisanImage';

export const FranchiseSection: React.FC = () => {
  const [form, setForm] = useState<FranchiseInput>({
    fullName: '',
    phone: '',
    area: '',
    inquiryType: 'nhuong-quyen',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateFranchiseForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const apiResult = await submitInquiry(form);
    setSubmitting(false);

    if (!apiResult.ok) {
      setSubmitError(
        apiResult.errorMessage || 'Không thể gửi hồ sơ lúc này. Vui lòng thử lại.'
      );
      return;
    }

    setSubmittedRef(apiResult.code);
  };

  const resetForm = () => {
    setForm({
      fullName: '',
      phone: '',
      area: '',
      inquiryType: 'nhuong-quyen',
      notes: '',
    });
    setErrors({});
    setSubmittedRef(null);
  };

  return (
    <section id="nhuong-quyen" className="scroll-mt-[76px] py-14 lg:py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left column: Chain partnership overview */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <p className="text-[13px] font-medium text-[#9A4D10] mb-1.5">
                Phát triển chuỗi &amp; B2B
              </p>
              <h2 className="font-display text-3xl sm:text-[2.1rem] font-semibold tracking-[-0.015em] text-[#1C1613] mb-3.5">
                Nhượng quyền cửa hàng &amp; Đặt tiệc doanh nghiệp
              </h2>
              <p className="text-[15px] text-[#57504A] leading-[1.7]">
                Đồng bộ từ thiết kế quầy gỗ, lò nướng đối lưu, nguồn bột ủ chuẩn hóa đến cà phê
                rang xay riêng cho đối tác nhượng quyền và đơn hàng Teabreak văn phòng.
              </p>
            </div>

            <div className="group aspect-[16/8.5] rounded-lg overflow-hidden border border-[#EAE5DD]">
              <ArtisanImage
                src="/assets/aistudio/pexels-aleksey-nosov-81016902-11132931_011c54a9.jpg"
                alt="Bánh mì lát giòn kèm thịt nguội, rau xanh và ly cà phê nóng phục vụ trên khay gỗ dưới nắng sớm"
                imgClassName="object-[50%_62%] origin-[50%_62%] scale-[1.08]"
                caption="Tiêu chuẩn Teabreak & phục vụ đồng bộ tại quầy"
              />
            </div>

            <div className="divide-y divide-[#EAE5DD] border-t border-b border-[#EAE5DD] text-sm">
              <div className="py-3 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#1C1613]">Mô hình Kiosk / Mang đi</span>
                <span className="tabular-nums text-[#57504A]">18 – 25 m²</span>
              </div>
              <div className="py-3 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#1C1613]">Mô hình Flagship tại chỗ</span>
                <span className="tabular-nums text-[#57504A]">45 – 80 m²</span>
              </div>
              <div className="py-3 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#1C1613]">Đặt tiệc Teabreak / Hội nghị</span>
                <span className="tabular-nums font-medium text-[#275D3B]">Từ 20 phần</span>
              </div>
            </div>
          </div>

          {/* Right column: Validated Inquiry Form */}
          <div className="lg:col-span-7 rounded-lg border border-[#E6E1D9] bg-[#F8F6F2] p-6 sm:p-8 flex flex-col justify-between">
            {submittedRef ? (
              <div className="py-6">
                <div className="flex items-center gap-3 text-[#275D3B] mb-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-semibold text-[#1C1613]">
                    Đã ghi nhận yêu cầu hợp tác
                  </h3>
                </div>
                <p className="text-sm text-[#57504A] leading-relaxed mb-5">
                  Cảm ơn <span className="font-semibold text-[#1C1613]">{form.fullName}</span>.
                  Bộ phận phát triển chuỗi Xíu sẽ liên hệ qua số{' '}
                  <span className="tabular-nums font-semibold text-[#1C1613]">
                    {form.phone}
                  </span>{' '}
                  trong vòng 24 giờ làm việc.
                </p>
                <div className="p-4 rounded-md bg-white border border-[#E6E1D9] text-sm space-y-1 mb-6">
                  <p>
                    Mã hồ sơ:{' '}
                    <span className="tabular-nums font-semibold text-[#1C1613]">
                      #{submittedRef}
                    </span>
                  </p>
                  <p className="text-[#57504A]">
                    Khu vực: {form.area}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-md border border-[#D8D0C4] bg-white text-sm font-medium text-[#1C1613] hover:border-[#1C1613] cursor-pointer"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#1C1613]">
                    Đăng ký nhận hồ sơ &amp; báo giá
                  </h3>
                  <p className="text-sm text-[#57504A] mt-1">
                    Điền thông tin bên dưới để nhận bảng dự toán đầu tư hoặc thực đơn tiệc văn phòng.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="franchise-name"
                      className="block text-sm font-medium text-[#1C1613] mb-1.5"
                    >
                      Họ và tên / Đơn vị <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Nguyễn Văn An"
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="franchise-phone"
                      className="block text-sm font-medium text-[#1C1613] mb-1.5"
                    >
                      Số điện thoại <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0909123456"
                      aria-invalid={Boolean(errors.phone)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] tabular-nums focus:outline-none focus:border-[#9A4D10]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="franchise-area"
                      className="block text-sm font-medium text-[#1C1613] mb-1.5"
                    >
                      Quận / Tỉnh thành dự kiến <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-area"
                      type="text"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="Quận 3, TP.HCM"
                      aria-invalid={Boolean(errors.area)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                    />
                    {errors.area && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.area}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="franchise-type"
                      className="block text-sm font-medium text-[#1C1613] mb-1.5"
                    >
                      Hình thức quan tâm
                    </label>
                    <select
                      id="franchise-type"
                      value={form.inquiryType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          inquiryType: e.target.value as FranchiseInput['inquiryType'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                    >
                      <option value="nhuong-quyen">Nhượng quyền cửa hàng Xíu</option>
                      <option value="teabreak">Đặt tiệc Teabreak văn phòng</option>
                      <option value="cung-cap-si">Cung cấp sỉ bánh mì tươi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="franchise-notes"
                    className="block text-sm font-medium text-[#1C1613] mb-1.5"
                  >
                    Ghi chú mặt bằng hoặc số lượng phần ăn
                  </label>
                  <textarea
                    id="franchise-notes"
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ví dụ: Đang có mặt bằng góc 2 mặt tiền 40m² tại Tân Bình, hoặc cần 50 phần bánh mì + cà phê sáng thứ Sáu..."
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                  />
                </div>

                {submitError && (
                  <p role="alert" className="text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-md px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-md bg-[#9A4D10] text-white text-sm font-semibold hover:bg-[#7E3E0B] disabled:opacity-65 disabled:cursor-wait transition-colors cursor-pointer"
                  >
                    {submitting ? 'Đang gửi thông tin...' : 'Gửi thông tin liên hệ'}
                  </button>
                  <p className="text-xs text-[#766E67]">
                    Bộ phận phát triển chuỗi phản hồi trong 24 giờ làm việc
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
