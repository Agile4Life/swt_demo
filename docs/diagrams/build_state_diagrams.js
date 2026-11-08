// build_state_diagrams.js
// Tạo file state_diagrams.drawio với 12 biểu đồ trạng thái (State Machine Diagrams) chuẩn UML hoàn toàn bằng Tiếng Việt.
const fs = require('fs');
const path = require('path');

function buildDiagrams() {
  const pages = [];

  // Định dạng Text & Khung
  const STYLE_TITLE = 'text;html=1;fontSize=18;fontStyle=1;fillColor=none;strokeColor=none;align=center;fontColor=#2C3E50;';
  const STYLE_SUBTITLE = 'text;html=1;fontSize=11;fillColor=none;strokeColor=none;align=center;fontColor=#7F8C8D;fontStyle=2;';
  const STYLE_NOTE = 'shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;size=15;fillColor=#FFF9C4;strokeColor=#FBC02D;fontSize=10;align=left;spacingLeft=8;fontColor=#424242;';
  const STYLE_START = 'ellipse;fillColor=#2C3E50;strokeColor=#2C3E50;aspect=fixed;';
  const STYLE_END_OUTER = 'ellipse;fillColor=#FFFFFF;strokeColor=#2C3E50;strokeWidth=2;aspect=fixed;';
  const STYLE_END_INNER = 'ellipse;fillColor=#2C3E50;strokeColor=#2C3E50;aspect=fixed;';

  // Định dạng Trạng thái (Pastel States)
  const STYLE_STATE_DEFAULT = 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;fontSize=13;fontStyle=1;fillColor=#E8F5E9;strokeColor=#4CAF50;fontColor=#1B5E20;shadow=0;';
  const STYLE_STATE_INITIAL = 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;fontSize=13;fontStyle=1;fillColor=#FFF8E1;strokeColor=#FFA000;fontColor=#E65100;shadow=0;';
  const STYLE_STATE_INFO = 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;fontSize=13;fontStyle=1;fillColor=#E3F2FD;strokeColor=#1976D2;fontColor=#0D47A1;shadow=0;';
  const STYLE_STATE_WARN = 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;fontSize=13;fontStyle=1;fillColor=#F3E5F5;strokeColor=#8E24AA;fontColor=#4A148C;shadow=0;';
  const STYLE_STATE_DANGER = 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;fontSize=13;fontStyle=1;fillColor=#FFEBEE;strokeColor=#E53935;fontColor=#B71C1C;shadow=0;';

  // Định dạng Đường nối (Màu sắc theo ngữ nghĩa, label có nền trắng tránh cắt vạch)
  const EDGE_BASE = 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;fontSize=10;labelBackgroundColor=#ffffff;labelBorderColor=none;';
  const EDGE_DEFAULT = `${EDGE_BASE}strokeColor=#546E7A;fontColor=#37474F;`;
  const EDGE_SUCCESS = `${EDGE_BASE}strokeColor=#2E7D32;fontColor=#1B5E20;`;
  const EDGE_DANGER = `${EDGE_BASE}strokeColor=#C62828;fontColor=#B71C1C;`;
  const EDGE_WARN = `${EDGE_BASE}strokeColor=#EF6C00;fontColor=#E65100;`;
  const EDGE_INFO = `${EDGE_BASE}strokeColor=#1565C0;fontColor=#0D47A1;`;
  const EDGE_MUTED_DASH = `${EDGE_BASE}strokeColor=#9E9E9E;fontColor=#757575;dashed=1;`;

  function makeEdge(id, val, src, tgt, style, points = [], offset = { x: 0, y: -10 }) {
    let ptsXml = '';
    if (points && points.length > 0) {
      ptsXml = '<Array as="points">\n' + points.map(p => `  <mxPoint x="${p.x}" y="${p.y}" />`).join('\n') + '\n</Array>';
    }
    const offX = offset.x !== undefined ? offset.x : 0;
    const offY = offset.y !== undefined ? offset.y : -10;
    return `
      <mxCell id="${id}" value="${val}" style="${style}" edge="1" parent="1" source="${src}" target="${tgt}">
        <mxGeometry relative="1" as="geometry">
          <mxPoint x="${offX}" y="${offY}" as="offset" />
          ${ptsXml}
        </mxGeometry>
      </mxCell>
    `;
  }

  // ==========================================
  // TRANG 1: Tài khoản người dùng (User Account)
  // ==========================================
  pages.push({
    name: '1. Tài khoản người dùng',
    id: 'state-user-account',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Tài khoản người dùng" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 1 (Quản lý Hội viên &amp; Tài khoản) | Bảng: users.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_reg" value="Đang đăng ký" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="180" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_active" value="Đang hoạt động" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_locked" value="Bị khóa" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="240" y="520" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_inactive" value="Tạm ngưng" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="720" y="520" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="690" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="697" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', '', 's_start', 's_reg', EDGE_DEFAULT)}
        ${makeEdge('e_verify', 'Xác thực OTP thành công', 's_reg', 's_active', EDGE_SUCCESS, [], { x: 80, y: 0 })}
        ${makeEdge('e_reg_cancel', 'Hủy / Quá thời gian xác thực', 's_reg', 's_end_ring', `${EDGE_DANGER}dashed=1;`, [{ x: 920, y: 203 }, { x: 920, y: 705 }], { x: 90, y: 0 })}
        ${makeEdge('e_lock', 'Khóa tài khoản / Vi phạm quy định', 's_active', 's_locked', EDGE_DANGER, [{ x: 500, y: 440 }, { x: 310, y: 440 }], { x: 0, y: -10 })}
        ${makeEdge('e_unlock', 'Mở khóa tài khoản', 's_locked', 's_active', EDGE_SUCCESS, [{ x: 180, y: 543 }, { x: 180, y: 363 }], { x: -65, y: 0 })}
        ${makeEdge('e_deact', 'Tạm ngưng (Tự chọn / Quản trị)', 's_active', 's_inactive', EDGE_WARN, [{ x: 600, y: 440 }, { x: 790, y: 440 }], { x: 0, y: -10 })}
        ${makeEdge('e_react', 'Kích hoạt lại tài khoản', 's_inactive', 's_active', EDGE_SUCCESS, [{ x: 880, y: 543 }, { x: 880, y: 363 }], { x: 70, y: 0 })}
        ${makeEdge('e_softdel', 'Xóa mềm (deleted_at)', 's_active', 's_end_ring', EDGE_MUTED_DASH, [], { x: 75, y: -80 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN ('active','inactive','locked'))&#xa;• Mặc định: 'active' sau khi xác thực&#xa;• Xóa mềm: deleted_at IS NOT NULL&#xa;  (Lưu trọn vẹn lịch sử kiểm toán)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="110" width="220" height="110" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 2: Gói hội viên (Membership Subscription)
  // ==========================================
  pages.push({
    name: '2. Gói hội viên',
    id: 'state-membership-sub',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Gói hội viên" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 1 &amp; Luồng 3 | Bảng: membership_subscriptions.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_pending" value="Chờ thanh toán" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="465" y="180" width="170" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_active" value="Đang hiệu lực" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_expired" value="Đã hết hạn" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="260" y="520" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_cancelled" value="Đã hủy gói" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="700" y="520" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="690" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="697" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Chọn gói tập', 's_start', 's_pending', EDGE_DEFAULT, [], { x: 55, y: 0 })}
        ${makeEdge('e_pay_ok', 'Thanh toán thành công / Cấp QR', 's_pending', 's_active', EDGE_SUCCESS, [], { x: 105, y: 0 })}
        ${makeEdge('e_pending_cancel', 'Hủy đơn / Thanh toán thất bại', 's_pending', 's_cancelled', EDGE_DANGER, [{ x: 860, y: 203 }, { x: 860, y: 543 }], { x: 95, y: 0 })}
        ${makeEdge('e_expire', 'Hết hạn: end_date &lt; hôm nay', 's_active', 's_expired', EDGE_WARN, [{ x: 330, y: 363 }], { x: 0, y: -10 })}
        ${makeEdge('e_cancel', 'Quản trị hủy gói / Hoàn tiền', 's_active', 's_cancelled', EDGE_DANGER, [{ x: 740, y: 363 }], { x: 0, y: -10 })}
        ${makeEdge('e_extend', 'Gia hạn thời hạn (end_date)', 's_active', 's_active', EDGE_SUCCESS, [{ x: 550, y: 420 }, { x: 640, y: 420 }, { x: 640, y: 350 }], { x: 0, y: 10 })}
        ${makeEdge('e_renew', 'Đăng ký gói mới', 's_expired', 's_pending', `${EDGE_INFO}dashed=1;`, [{ x: 40, y: 543 }, { x: 40, y: 203 }], { x: 65, y: 0 })}
        ${makeEdge('e_exp_end', '', 's_expired', 's_end_ring', EDGE_MUTED_DASH, [{ x: 330, y: 705 }])}
        ${makeEdge('e_can_end', '', 's_cancelled', 's_end_ring', EDGE_MUTED_DASH, [{ x: 770, y: 705 }])}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'pending_payment',&#xa;  'active',&#xa;  'expired',&#xa;  'cancelled'))&#xa;&#xa;Quyền lợi gói hiệu lực:&#xa;• Quét QR check-in qua cổng&#xa;• Đặt chỗ lịch lớp học" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="60" y="70" width="200" height="105" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 3: Đăng ký lớp học (Class Enrollment)
  // ==========================================
  pages.push({
    name: '3. Đăng ký lớp học',
    id: 'state-class-enrollment',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Đăng ký lớp học" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 2 (Đặt chỗ &amp; Lịch học) | Bảng: class_enrollments.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="110" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_booked" value="Đã đặt chỗ" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="230" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_cancelled" value="Đã hủy chỗ" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="240" y="410" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_completed" value="Đã hoàn thành" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="720" y="410" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="580" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="587" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Đặt lớp [Gói còn hạn &amp; Lớp còn chỗ]', 's_start', 's_booked', EDGE_SUCCESS, [], { x: 120, y: 0 })}
        ${makeEdge('e_cancel', 'Tự hủy qua App / Lễ tân hỗ trợ hủy', 's_booked', 's_cancelled', EDGE_DANGER, [{ x: 310, y: 253 }], { x: 20, y: -10 })}
        ${makeEdge('e_complete', 'Hoàn thành toàn bộ khóa học', 's_booked', 's_completed', EDGE_SUCCESS, [{ x: 790, y: 253 }], { x: 20, y: -10 })}
        ${makeEdge('e_can_end', 'Giải phóng chỗ &amp; cập nhật sĩ số', 's_cancelled', 's_end_ring', EDGE_DEFAULT, [{ x: 310, y: 595 }], { x: 0, y: -10 })}
        ${makeEdge('e_com_end', 'Lưu kết quả điểm danh &amp; đánh giá', 's_completed', 's_end_ring', EDGE_DEFAULT, [{ x: 790, y: 595 }], { x: 0, y: -10 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'booked',&#xa;  'cancelled',&#xa;  'completed'))&#xa;&#xa;Filtered Unique Index:&#xa;Mỗi hội viên chỉ có 1 đặt chỗ&#xa;hiệu lực cho mỗi lớp học&#xa;(WHERE status = 'booked')" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="80" width="190" height="130" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 4: Buổi học (Class Session)
  // ==========================================
  pages.push({
    name: '4. Buổi học',
    id: 'state-class-session',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Buổi học" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 5 (Huấn luyện &amp; Kế hoạch tập) | Bảng: class_sessions.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="110" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_scheduled" value="Đã lên lịch" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="480" y="220" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_completed" value="Đã hoàn thành" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="250" y="400" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_cancelled" value="Đã hủy buổi" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="710" y="400" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="570" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="577" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Lập lịch [Không trùng HLV &amp; Phòng]', 's_start', 's_scheduled', EDGE_SUCCESS, [], { x: 120, y: 0 })}
        ${makeEdge('e_finish', 'HLV ghi nhận kết quả &amp; điểm danh', 's_scheduled', 's_completed', EDGE_SUCCESS, [{ x: 320, y: 243 }], { x: 20, y: -10 })}
        ${makeEdge('e_cancel', 'HLV bận đột xuất / Sự cố phòng tập', 's_scheduled', 's_cancelled', EDGE_DANGER, [{ x: 780, y: 243 }], { x: 20, y: -10 })}
        ${makeEdge('e_comp_end', 'Đồng bộ tiến độ &amp; bài tập về nhà', 's_completed', 's_end_ring', EDGE_DEFAULT, [{ x: 320, y: 585 }], { x: 0, y: -10 })}
        ${makeEdge('e_canc_end', 'Ghi nhận lý do &amp; thông báo học viên', 's_cancelled', 's_end_ring', EDGE_DEFAULT, [{ x: 780, y: 585 }], { x: 0, y: -10 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'scheduled',&#xa;  'completed',&#xa;  'cancelled'))&#xa;&#xa;Trigger kiểm tra xung đột:&#xa;• trg_sessions_check_conflict&#xa;  (Lịch HLV &amp; Lịch phòng tập)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="80" width="200" height="120" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 5: Giao dịch thanh toán (Payment)
  // ==========================================
  pages.push({
    name: '5. Giao dịch thanh toán',
    id: 'state-payment',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Giao dịch thanh toán" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 3 (Thanh toán &amp; Quản lý doanh thu) | Bảng: payments.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_pending" value="Chờ thanh toán" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="190" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_success" value="Thành công" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_failed" value="Thất bại" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="780" y="190" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_refunded" value="Đã hoàn tiền" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="200" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="530" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="537" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Khởi tạo [Chọn hình thức]', 's_start', 's_pending', EDGE_DEFAULT, [], { x: -85, y: 0 })}
        ${makeEdge('e_ok', 'Giao dịch được xác nhận', 's_pending', 's_success', EDGE_SUCCESS, [], { x: 85, y: 0 })}
        ${makeEdge('e_fail', 'Giao dịch lỗi / Thẻ từ chối', 's_pending', 's_failed', EDGE_DANGER, [], { x: 0, y: -10 })}
        ${makeEdge('e_retry', 'Thử thanh toán lại', 's_failed', 's_pending', `${EDGE_INFO}dashed=1;`, [{ x: 850, y: 145 }, { x: 580, y: 145 }], { x: 0, y: -10 })}
        ${makeEdge('e_refund', 'Yêu cầu &amp; duyệt hoàn tiền', 's_success', 's_refunded', EDGE_WARN, [], { x: 0, y: -10 })}
        ${makeEdge('e_suc_end', 'Xuất hóa đơn &amp; ghi nhận doanh thu', 's_success', 's_end_ring', EDGE_SUCCESS, [], { x: 110, y: 0 })}
        ${makeEdge('e_ref_end', 'Cập nhật sổ cái tài chính', 's_refunded', 's_end_ring', EDGE_DEFAULT, [{ x: 270, y: 545 }], { x: 40, y: -10 })}
        ${makeEdge('e_fail_end', 'Hủy bỏ thanh toán', 's_failed', 's_end_ring', EDGE_MUTED_DASH, [{ x: 850, y: 545 }], { x: -40, y: -10 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'success',&#xa;  'pending',&#xa;  'failed',&#xa;  'refunded'))&#xa;&#xa;Phương thức thanh toán:&#xa;• Tiền mặt (cash), Máy POS,&#xa;• Chuyển khoản ngân hàng,&#xa;• Ví điện tử trực tuyến" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="100" width="190" height="140" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 6: Yêu cầu hỗ trợ (Support Request)
  // ==========================================
  pages.push({
    name: '6. Yêu cầu hỗ trợ',
    id: 'state-support-request',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Yêu cầu hỗ trợ" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng Chăm sóc khách hàng | Bảng: support_requests.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_open" value="Đang mở" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="180" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_inprogress" value="Đang xử lý" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="480" y="320" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_resolved" value="Đã giải quyết" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="460" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_closed" value="Đã đóng" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="480" y="600" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="710" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="717" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Gửi yêu cầu hỗ trợ', 's_start', 's_open', EDGE_DEFAULT, [], { x: 75, y: 0 })}
        ${makeEdge('e_assign', 'Phân công nhân viên xử lý', 's_open', 's_inprogress', EDGE_INFO, [], { x: 85, y: 0 })}
        ${makeEdge('e_resolve', 'Đưa ra phương án xử lý', 's_inprogress', 's_resolved', EDGE_SUCCESS, [], { x: 80, y: 0 })}
        ${makeEdge('e_close', 'HV xác nhận / Tự đóng sau 72h', 's_resolved', 's_closed', EDGE_DEFAULT, [], { x: 105, y: 0 })}
        ${makeEdge('e_moreinfo', 'Yêu cầu thêm thông tin', 's_inprogress', 's_open', `${EDGE_WARN}dashed=1;`, [{ x: 300, y: 343 }, { x: 300, y: 203 }], { x: -80, y: 0 })}
        ${makeEdge('e_withdraw', 'Hội viên rút lại yêu cầu', 's_open', 's_closed', EDGE_MUTED_DASH, [{ x: 810, y: 203 }, { x: 810, y: 623 }], { x: 85, y: 0 })}
        ${makeEdge('e_archive', 'Lưu trữ lịch sử hỗ trợ', 's_closed', 's_end_ring', EDGE_DEFAULT, [], { x: 80, y: 0 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'open',&#xa;  'in_progress',&#xa;  'resolved',&#xa;  'closed'))&#xa;&#xa;Nội dung trao đổi lưu tại:&#xa;support_request_messages" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="110" width="190" height="120" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 7: Kế hoạch tập luyện (Training Plan)
  // ==========================================
  pages.push({
    name: '7. Kế hoạch tập luyện',
    id: 'state-training-plan',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Kế hoạch tập luyện" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 4 &amp; Luồng 5 | Bảng: training_plans.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_draft" value="Bản nháp" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="190" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_active" value="Đang áp dụng" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="480" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_completed" value="Đã hoàn thành" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="260" y="490" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_cancelled" value="Đã hủy bỏ" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="700" y="490" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="630" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="637" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'HLV soạn kế hoạch (Tự lập / AI gợi ý)', 's_start', 's_draft', EDGE_DEFAULT, [], { x: 125, y: 0 })}
        ${makeEdge('e_active', 'HLV phê duyệt &amp; giao cho hội viên', 's_draft', 's_active', EDGE_SUCCESS, [], { x: 120, y: 0 })}
        ${makeEdge('e_draft_cancel', 'Hủy bỏ bản nháp', 's_draft', 's_cancelled', EDGE_DANGER, [{ x: 860, y: 213 }, { x: 860, y: 513 }], { x: 60, y: 0 })}
        ${makeEdge('e_complete', 'Hoàn thành toàn bộ bài tập', 's_active', 's_completed', EDGE_SUCCESS, [{ x: 330, y: 363 }], { x: -20, y: -10 })}
        ${makeEdge('e_active_cancel', 'Ngừng kế hoạch / Thay thế mới', 's_active', 's_cancelled', EDGE_DANGER, [{ x: 830, y: 363 }], { x: -20, y: -10 })}
        ${makeEdge('e_com_end', 'Ghi nhận mốc tiến độ thể lực', 's_completed', 's_end_ring', EDGE_DEFAULT, [{ x: 330, y: 645 }], { x: 40, y: -10 })}
        ${makeEdge('e_can_end', 'Lưu trữ hồ sơ kế hoạch', 's_cancelled', 's_end_ring', EDGE_MUTED_DASH, [{ x: 770, y: 645 }], { x: -40, y: -10 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'draft',&#xa;  'active',&#xa;  'completed',&#xa;  'cancelled'))&#xa;&#xa;Cờ nguồn gốc AI:&#xa;• is_ai_generated (BIT)&#xa;• ai_recommendation_id (FK)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="110" width="200" height="130" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 8: Check-in trung tâm (Center Check-in)
  // ==========================================
  pages.push({
    name: '8. Check-in trung tâm',
    id: 'state-center-checkin',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Check-in trung tâm" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng Nghiệp vụ Master | Bảng: center_checkins" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="55" width="500" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_arriving" value="Đến trung tâm" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="180" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_qr" value="Xuất trình mã QR" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="480" y="280" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_checkedin" value="Check-in hợp lệ" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="320" y="420" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_rejected" value="Bị từ chối vào" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="640" y="420" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_insession" value="Đang tập luyện" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="320" y="530" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_checkedout" value="Đã Check-out" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="320" y="640" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="740" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="747" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e1', 'Đến cổng kiểm soát', 's_start', 's_arriving', EDGE_DEFAULT, [], { x: 75, y: 0 })}
        ${makeEdge('e2', 'Quét mã QR trên App', 's_arriving', 's_qr', EDGE_DEFAULT, [], { x: 75, y: 0 })}
        ${makeEdge('e3_valid', 'Hợp lệ [Gói tập còn hạn]', 's_qr', 's_checkedin', EDGE_SUCCESS, [{ x: 390, y: 303 }], { x: -20, y: -10 })}
        ${makeEdge('e3_invalid', 'Từ chối [Hết hạn / Không hợp lệ]', 's_qr', 's_rejected', EDGE_DANGER, [{ x: 880, y: 303 }, { x: 880, y: 442 }], { x: 0, y: -10 })}
        ${makeEdge('e4', 'Vào khu vực Gym / Sân / Bể bơi', 's_checkedin', 's_insession', EDGE_DEFAULT, [], { x: 95, y: 0 })}
        ${makeEdge('e5', 'Tập xong / Quét thẻ ra', 's_insession', 's_checkedout', EDGE_DEFAULT, [], { x: 80, y: 0 })}
        ${makeEdge('e6', 'Lưu check_out_time &amp; nhật ký', 's_checkedout', 's_end_ring', EDGE_DEFAULT, [{ x: 390, y: 755 }], { x: 40, y: -10 })}
        ${makeEdge('e7', 'Nhắc nhở gia hạn gói tập', 's_rejected', 's_end_ring', EDGE_MUTED_DASH, [{ x: 710, y: 755 }], { x: -40, y: -10 })}

        <mxCell id="n1" value="QUY TẮC XÁC THỰC:&#xa;• method IN ('qr', 'manual')&#xa;• recorded_by: ID lễ tân&#xa;• Trigger đảm bảo hội viên có&#xa;  gói tập còn hiệu lực với&#xa;  end_date &gt;= CURRENT_DATE" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="110" width="200" height="130" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 9: Điểm danh buổi học (Session Attendance)
  // ==========================================
  pages.push({
    name: '9. Điểm danh buổi học',
    id: 'state-session-attendance',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Điểm danh buổi học" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 5 (Huấn luyện) | Bảng: session_attendance.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="55" width="500" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_unmarked" value="Chưa điểm danh" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="180" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_present" value="Có mặt" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="120" y="340" width="130" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_late" value="Đi muộn" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="340" y="340" width="130" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_absent" value="Vắng mặt" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="630" y="340" width="130" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_excused" value="Có phép" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="850" y="340" width="130" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="520" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="527" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Buổi học bắt đầu', 's_start', 's_unmarked', EDGE_DEFAULT, [], { x: 70, y: 0 })}
        ${makeEdge('e_pres', 'Đến đúng giờ', 's_unmarked', 's_present', EDGE_SUCCESS, [{ x: 185, y: 203 }], { x: -20, y: -10 })}
        ${makeEdge('e_late', 'Đến muộn', 's_unmarked', 's_late', EDGE_INFO, [{ x: 405, y: 203 }], { x: 0, y: -10 })}
        ${makeEdge('e_abs', 'Không đến', 's_unmarked', 's_absent', EDGE_DANGER, [{ x: 695, y: 203 }], { x: 0, y: -10 })}
        ${makeEdge('e_exc', 'Vắng có lý do', 's_unmarked', 's_excused', EDGE_WARN, [{ x: 915, y: 203 }], { x: 20, y: -10 })}

        ${makeEdge('e_pres_end', '', 's_present', 's_end_ring', EDGE_DEFAULT, [{ x: 185, y: 460 }, { x: 550, y: 460 }])}
        ${makeEdge('e_late_end', '', 's_late', 's_end_ring', EDGE_DEFAULT, [{ x: 405, y: 480 }, { x: 550, y: 480 }])}
        ${makeEdge('e_abs_end', '', 's_absent', 's_end_ring', EDGE_DEFAULT, [{ x: 695, y: 480 }, { x: 550, y: 480 }])}
        ${makeEdge('e_exc_end', '', 's_excused', 's_end_ring', EDGE_DEFAULT, [{ x: 915, y: 460 }, { x: 550, y: 460 }])}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'present',&#xa;  'absent',&#xa;  'late',&#xa;  'excused'))&#xa;&#xa;• Người ghi nhận = ID huấn luyện viên&#xa;• UNIQUE(session_id, member_id)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="80" width="190" height="100" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 10: Thông báo hệ thống (Notification)
  // ==========================================
  pages.push({
    name: '10. Thông báo hệ thống',
    id: 'state-notification',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Thông báo hệ thống" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 6 (Trợ lý AI &amp; Thông báo) | Bảng: notifications" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_triggered" value="Được kích hoạt" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="480" y="180" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_created" value="Đã tạo (is_read=0)" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="465" y="290" width="170" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_delivered" value="Đã gửi đến thiết bị" style="${STYLE_STATE_WARN}" vertex="1" parent="1">
          <mxGeometry x="475" y="400" width="150" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_read" value="Đã đọc (is_read=1)" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="470" y="510" width="160" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="620" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="627" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e1', 'Sự kiện hệ thống phát sinh', 's_start', 's_triggered', EDGE_DEFAULT, [], { x: 85, y: 0 })}
        ${makeEdge('e2', 'Tạo bản ghi thông báo', 's_triggered', 's_created', EDGE_DEFAULT, [], { x: 80, y: 0 })}
        ${makeEdge('e3', 'Gửi Push / SMS / Ứng dụng', 's_created', 's_delivered', EDGE_INFO, [], { x: 90, y: 0 })}
        ${makeEdge('e4', 'Người dùng mở đọc thông báo', 's_delivered', 's_read', EDGE_SUCCESS, [], { x: 95, y: 0 })}
        ${makeEdge('e5', 'Lưu trữ thông báo', 's_read', 's_end_ring', EDGE_DEFAULT, [], { x: 65, y: 0 })}

        <mxCell id="n1" value="CÁC LOẠI THÔNG BÁO:&#xa;• schedule_change (Đổi lịch)&#xa;• package_expiry (Hết hạn gói)&#xa;• class_reminder (Nhắc buổi học)&#xa;• system (Hệ thống)&#xa;• support_reply (Phản hồi HT)&#xa;• payment (Thanh toán)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="110" width="190" height="140" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 11: Phiên trò chuyện AI (AI Chat Session)
  // ==========================================
  pages.push({
    name: '11. Phiên trò chuyện AI',
    id: 'state-ai-chat',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Phiên trò chuyện AI" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 6 (Nhánh 1: Chatbot AI) | Bảng: ai_chat_sessions, ai_chat_messages" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="95" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_opened" value="Đã khởi tạo phiên" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="475" y="160" width="150" height="40" as="geometry" />
        </mxCell>

        <!-- Composite Active State Container -->
        <mxCell id="s_active_box" value="Đang hoạt động (Chu trình hội thoại)" style="swimlane;whiteSpace=wrap;html=1;startSize=26;fillColor=#E8F5E9;strokeColor=#4CAF50;fontColor=#1B5E20;fontSize=12;fontStyle=1;rounded=1;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="150" y="240" width="800" height="250" as="geometry" />
        </mxCell>
        <mxCell id="s_asking" value="Hội viên đặt câu hỏi" style="${STYLE_STATE_INFO}" vertex="1" parent="s_active_box">
          <mxGeometry x="30" y="60" width="150" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_processing" value="AI đang xử lý NLP" style="${STYLE_STATE_INITIAL}" vertex="1" parent="s_active_box">
          <mxGeometry x="290" y="60" width="150" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_replied" value="AI đã phản hồi" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="s_active_box">
          <mxGeometry x="580" y="60" width="150" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_rated" value="Đã đánh giá phản hồi" style="${STYLE_STATE_WARN}" vertex="1" parent="s_active_box">
          <mxGeometry x="580" y="170" width="150" height="45" as="geometry" />
        </mxCell>

        <!-- Chu trình chuyển trạng thái bên trong Active -->
        <mxCell id="ea1" value="Gửi tin nhắn / Prompt" style="${EDGE_DEFAULT}" edge="1" parent="s_active_box" source="s_asking" target="s_processing">
          <mxGeometry relative="1" as="geometry">
            <mxPoint y="-10" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="ea2" value="Sinh phản hồi ngôn ngữ" style="${EDGE_SUCCESS}" edge="1" parent="s_active_box" source="s_processing" target="s_replied">
          <mxGeometry relative="1" as="geometry">
            <mxPoint y="-10" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="ea3" value="Đánh giá 1-5 sao" style="${EDGE_WARN}" edge="1" parent="s_active_box" source="s_replied" target="s_rated">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="75" y="0" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="ea4" value="Đặt câu hỏi tiếp theo" style="${EDGE_INFO}dashed=1;" edge="1" parent="s_active_box" source="s_replied" target="s_asking">
          <mxGeometry relative="1" as="geometry">
            <mxPoint y="-10" as="offset" />
            <Array as="points">
              <mxPoint x="600" y="135" />
              <mxPoint x="105" y="135" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- Chuyển trạng thái mức ngoài -->
        ${makeEdge('e_start', '', 's_start', 's_opened', EDGE_DEFAULT)}
        ${makeEdge('e_enter_active', 'Gửi tin nhắn đầu tiên', 's_opened', 's_active_box', EDGE_DEFAULT, [], { x: 75, y: 0 })}
        <mxCell id="s_ended" value="Kết thúc phiên" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="480" y="540" width="140" height="45" as="geometry" />
        </mxCell>
        ${makeEdge('e_end_session', 'Đóng chat / Hết thời gian chờ', 's_active_box', 's_ended', EDGE_DANGER, [], { x: 95, y: 0 })}
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="640" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="647" width="16" height="16" as="geometry" />
        </mxCell>
        ${makeEdge('e_final', 'Lưu lịch sử hội thoại', 's_ended', 's_end_ring', EDGE_DEFAULT, [], { x: 75, y: 0 })}

        <mxCell id="n1" value="MÔ HÌNH DỮ LIỆU:&#xa;• ai_chat_sessions (id, member_id,&#xa;  started_at, ended_at)&#xa;• ai_chat_messages (id, session_id,&#xa;  sender IN ('member','ai'), message)" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="90" width="200" height="110" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // ==========================================
  // TRANG 12: Danh sách chờ lớp học (Class Waitlist)
  // ==========================================
  pages.push({
    name: '12. Hàng chờ lớp học',
    id: 'state-class-waitlist',
    content: `
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Sơ đồ trạng thái: Hàng chờ lớp học" style="${STYLE_TITLE}" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="500" height="40" as="geometry" />
        </mxCell>
        <mxCell id="subtitle" value="Nguồn: Luồng 2 (Đặt chỗ lớp học) | Bảng: class_waitlists.status" style="${STYLE_SUBTITLE}" vertex="1" parent="1">
          <mxGeometry x="250" y="55" width="600" height="20" as="geometry" />
        </mxCell>
        <mxCell id="s_start" value="" style="${STYLE_START}" vertex="1" parent="1">
          <mxGeometry x="535" y="100" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_waiting" value="Đang trong hàng chờ" style="${STYLE_STATE_INITIAL}" vertex="1" parent="1">
          <mxGeometry x="470" y="190" width="160" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_notified" value="Đã báo có chỗ" style="${STYLE_STATE_INFO}" vertex="1" parent="1">
          <mxGeometry x="320" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_expired" value="Đã hết hạn chờ" style="${STYLE_STATE_DANGER}" vertex="1" parent="1">
          <mxGeometry x="640" y="340" width="140" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_booked" value="→ Đã vào lớp (Booked)" style="${STYLE_STATE_DEFAULT}" vertex="1" parent="1">
          <mxGeometry x="200" y="490" width="170" height="45" as="geometry" />
        </mxCell>
        <mxCell id="s_end_ring" value="" style="${STYLE_END_OUTER}" vertex="1" parent="1">
          <mxGeometry x="535" y="590" width="30" height="30" as="geometry" />
        </mxCell>
        <mxCell id="s_end_dot" value="" style="${STYLE_END_INNER}" vertex="1" parent="1">
          <mxGeometry x="542" y="597" width="16" height="16" as="geometry" />
        </mxCell>

        ${makeEdge('e_start', 'Vào hàng chờ [Lớp đã đầy chỗ]', 's_start', 's_waiting', EDGE_DEFAULT, [], { x: 105, y: 0 })}
        ${makeEdge('e_notify', 'Có chỗ trống -> Báo tin nhắn Push', 's_waiting', 's_notified', EDGE_INFO, [{ x: 390, y: 213 }], { x: -20, y: -10 })}
        ${makeEdge('e_timeout', 'Hết hạn thời gian giữ chỗ', 's_waiting', 's_expired', EDGE_DANGER, [{ x: 710, y: 213 }], { x: 20, y: -10 })}
        ${makeEdge('e_accept', 'Xác nhận vào lớp trong 24h', 's_notified', 's_booked', EDGE_SUCCESS, [{ x: 285, y: 420 }], { x: -20, y: -10 })}
        ${makeEdge('e_decline', 'Từ chối / Quá hạn phản hồi', 's_notified', 's_expired', EDGE_DANGER, [{ x: 550, y: 363 }], { x: 0, y: -10 })}
        ${makeEdge('e_book_end', 'Chuyển sang luồng Đăng ký lớp', 's_booked', 's_end_ring', EDGE_DEFAULT, [{ x: 285, y: 605 }], { x: 40, y: -10 })}
        ${makeEdge('e_exp_end', 'Xóa khỏi hàng đợi', 's_expired', 's_end_ring', EDGE_MUTED_DASH, [{ x: 710, y: 605 }], { x: -50, y: -10 })}

        <mxCell id="n1" value="RÀNG BUỘC CƠ SỞ DỮ LIỆU:&#xa;• CHECK (status IN (&#xa;  'waiting',&#xa;  'notified',&#xa;  'expired'))&#xa;&#xa;Filtered Unique Index:&#xa;UNIQUE(class_id, member_id)&#xa;WHERE status = 'waiting'" style="${STYLE_NOTE}" vertex="1" parent="1">
          <mxGeometry x="50" y="80" width="190" height="120" as="geometry" />
        </mxCell>
      </root>
    `
  });

  // Tạo file XML hoàn chỉnh
  let xml = `<mxfile host="Electron" agent="antigravity" pages="${pages.length}">\n`;
  pages.forEach(p => {
    xml += `  <diagram name="${p.name}" id="${p.id}">\n`;
    xml += `    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">\n`;
    xml += p.content.trim() + '\n';
    xml += `    </mxGraphModel>\n`;
    xml += `  </diagram>\n`;
  });
  xml += `</mxfile>\n`;

  const targetPath = path.join(__dirname, 'state_diagrams.drawio');
  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`Đã xuất thành công ${pages.length} trang biểu đồ trạng thái sang ${targetPath}`);

  // Tự động kết xuất ảnh chụp màn hình PNG bằng draw.io Desktop CLI
  const drawio = 'C:\\Program Files\\draw.io\\draw.io.exe';
  const outDir = path.join(__dirname, 'screenshots');
  if (fs.existsSync(drawio)) {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const { execSync } = require('child_process');
    for (let i = 1; i <= pages.length; i++) {
      const dest = path.join(outDir, `page_${i}.png`);
      try {
        execSync(`"${drawio}" -x -f png -p ${i} -b 25 -s 2 -o "${dest}" "${targetPath}"`);
      } catch (err) {
        console.error(`Lỗi khi xuất trang ${i}:`, err.message);
      }
    }
    console.log(`Đã hoàn tất kết xuất toàn bộ ${pages.length} trang ảnh PNG vào thư mục: ${outDir}`);
  }
}

buildDiagrams();
