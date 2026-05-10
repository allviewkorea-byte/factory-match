

// ──────────────────────────────────────────────────────────
// TermsPage — 이용약관
// ──────────────────────────────────────────────────────────
const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-page-container">
        <h1 className="legal-page-title">이용약관</h1>
        <p className="legal-page-meta">
          시행일: 2026년 5월 6일<br/>
          최종 수정일: 2026년 5월 6일
        </p>

        <section className="legal-section">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 주식회사 올뷰코리아(이하 "회사")가 제공하는 공장매칭(FactoryMatch, 이하 "서비스")의
            이용 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="legal-section">
          <h2>제2조 (정의)</h2>
          <ol>
            <li>"서비스"란 회사가 제공하는 공장매칭(FactoryMatch) 웹사이트 및 관련 부가 서비스 일체를 말합니다.</li>
            <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"제조업체 정보"란 공공데이터포털 등 공개된 정보를 기반으로 본 서비스에 등록된 국내 제조업체의 사업자 정보를 말합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제3조 (서비스의 목적 및 내용)</h2>
          <p>본 서비스는 다음 목적을 위해 운영됩니다:</p>
          <ol>
            <li>국내 제조업체와 발주 기업 간 B2B 거래 매칭</li>
            <li>제조업체 정보 검색 및 비교 서비스 제공</li>
            <li>견적 요청(RFQ) 및 거래 연결 지원</li>
            <li>거래 신뢰도 검증을 위한 사업자 정보 제공</li>
          </ol>
          <p>회사는 위 목적 외 본 서비스에서 제공되는 정보를 마케팅 등 다른 목적으로 사용하는 것을 금지합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제4조 (약관의 효력 및 변경)</h2>
          <ol>
            <li>본 약관은 서비스를 이용하는 모든 이용자에게 그 효력이 발생합니다.</li>
            <li>이용자가 본 서비스를 이용하는 행위는 본 약관에 동의한 것으로 간주됩니다.</li>
            <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 효력이 발생합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제5조 (제조업체 정보의 출처 및 활용)</h2>
          <ol>
            <li>본 서비스에 등록된 제조업체 정보는 다음의 공개 데이터를 기반으로 합니다:
              <ul>
                <li>공공데이터포털(data.go.kr)에 공개된 공장 등록 정보</li>
                <li>국세청 사업자등록정보 진위확인 및 상태조회 서비스</li>
                <li>금융위원회 기업 기본정보 및 재무정보</li>
                <li>각 지방자치단체가 공개한 공장 정보</li>
              </ul>
            </li>
            <li>본 서비스의 정보는 거래 신뢰도 검증을 위한 참고 자료이며, 법적 효력이 있는 증빙 자료가 아닙니다.</li>
            <li>회사는 정보의 정확성을 위해 정기적으로 데이터를 갱신하나, 실시간 정확성을 보장하지 않습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제6조 (이용자의 의무)</h2>
          <ol>
            <li>이용자는 본 서비스에서 제공받은 정보를 다음 목적으로만 사용해야 합니다:
              <ul>
                <li>B2B 제조 거래 검토 및 진행</li>
                <li>거래 상대방의 신뢰도 검증</li>
              </ul>
            </li>
            <li>이용자는 본 서비스에서 얻은 정보를 다음 행위에 사용해서는 안 됩니다:
              <ul>
                <li>무단 마케팅, 광고성 메시지 발송, 스팸 행위</li>
                <li>제3자에게 정보를 무단 제공, 판매, 재배포</li>
                <li>법령 또는 공서양속에 위반되는 행위</li>
                <li>회사 또는 제3자의 권리를 침해하는 행위</li>
              </ul>
            </li>
            <li>위 의무를 위반한 이용자는 그로 인해 발생한 모든 법적 책임을 부담하며, 회사는 해당 이용자의 서비스 이용을 제한할 수 있습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제7조 (정보의 정정·삭제 요청)</h2>
          <ol>
            <li>제조업체 정보의 정정 또는 삭제를 원하는 경우, 다음 방법으로 요청할 수 있습니다:
              <ul>
                <li>사이트 내 신고 폼: [정정·삭제 요청] (서비스 내 별도 페이지)</li>
                <li>이메일: privacy@avk-agency.com</li>
              </ul>
            </li>
            <li>회사는 요청을 접수한 후 영업일 기준 5일 이내에 검토 및 처리합니다.</li>
            <li>다음의 경우 정정·삭제 요청이 거부될 수 있습니다:
              <ul>
                <li>법령에서 공개를 의무화한 정보</li>
                <li>이미 공공데이터로 공개된 정보 (이 경우 원본 출처에 정정 요청 안내)</li>
                <li>요청자가 정보 주체임을 증명하지 못하는 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제8조 (서비스의 제공 및 중단)</h2>
          <ol>
            <li>회사는 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.</li>
            <li>다음의 경우 사전 공지 없이 서비스가 일시 중단될 수 있습니다:
              <ul>
                <li>시스템 점검, 보수, 교체</li>
                <li>천재지변, 정전, 통신 장애 등 불가항력적 사유</li>
                <li>회사가 합리적으로 판단한 사정상 서비스 제공이 불가능한 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제9조 (책임의 제한)</h2>
          <ol>
            <li>회사는 본 서비스를 통해 제공되는 정보의 정확성, 완전성에 대해 합리적인 노력을 다하나, 정보의 절대적 정확성을 보장하지 않습니다.</li>
            <li>이용자가 본 서비스의 정보를 신뢰하여 발생한 손해에 대해 회사는 다음의 경우 책임을 지지 않습니다:
              <ul>
                <li>공공데이터의 원본 자체에 오류가 있는 경우</li>
                <li>이용자가 정보를 본 약관의 목적 외로 사용하여 발생한 손해</li>
                <li>거래 당사자 간 분쟁에 회사가 개입하지 않은 경우</li>
              </ul>
            </li>
            <li>본 서비스는 거래 매칭 플랫폼이며, 회사는 이용자 간 거래의 당사자가 아닙니다. 거래 결과에 대한 책임은 거래 당사자에게 있습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제10조 (지적재산권)</h2>
          <ol>
            <li>본 서비스의 디자인, 로고, 콘텐츠 구성, 매칭 알고리즘 등에 대한 저작권은 회사에 귀속됩니다.</li>
            <li>이용자는 회사의 사전 동의 없이 본 서비스의 콘텐츠를 복제, 배포, 상업적 이용할 수 없습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제11조 (분쟁의 해결)</h2>
          <ol>
            <li>본 약관과 관련된 분쟁은 대한민국 법령을 적용합니다.</li>
            <li>본 서비스 이용으로 발생한 분쟁의 관할 법원은 회사 본사 소재지 관할 법원으로 합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제12조 (회사 정보)</h2>
          <ul className="legal-company-info">
            <li><strong>회사명:</strong> 주식회사 올뷰코리아 (AVK)</li>
            <li><strong>서비스명:</strong> 공장매칭(FactoryMatch)</li>
            <li><strong>대표 이메일:</strong> <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
            <li><strong>웹사이트:</strong> [본 서비스 URL]</li>
          </ul>
        </section>

        <p className="legal-page-footer">
          본 약관은 2026년 5월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// PrivacyPage — 개인정보처리방침
// ──────────────────────────────────────────────────────────
const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-page-container">
        <h1 className="legal-page-title">개인정보처리방침</h1>
        <p className="legal-page-meta">
          시행일: 2026년 5월 6일<br/>
          최종 수정일: 2026년 5월 6일
        </p>

        <section className="legal-section">
          <h2>제1조 (총칙)</h2>
          <p>
            주식회사 올뷰코리아(이하 "회사")는 공장매칭(FactoryMatch, 이하 "서비스")을 운영함에 있어
            이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하기 위하여 노력하고 있습니다.
          </p>
          <p>
            본 개인정보처리방침은 회사가 제공하는 서비스 이용과 관련하여 이용자의 개인정보 처리에 관한 사항을 규정합니다.
          </p>
        </section>

        <section className="legal-section">
          <h2>제2조 (수집하는 개인정보의 항목 및 수집 방법)</h2>
          <p>회사는 다음 항목을 수집할 수 있습니다:</p>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>1. 자동 수집 항목</h3>
          <ul>
            <li>접속 IP 주소, 쿠키, 접속 일시, 서비스 이용 기록</li>
            <li>브라우저 종류, OS, 디바이스 정보</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>2. 견적 요청(RFQ) 시 수집 항목</h3>
          <ul>
            <li>필수: 회사명, 담당자명, 연락처(이메일 또는 전화번호), 요청 내용</li>
            <li>선택: 첨부 파일, 추가 요구사항</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>3. 신고·문의 시 수집 항목</h3>
          <ul>
            <li>필수: 회사명, 담당자명, 연락처, 신고 사유</li>
            <li>선택: 증빙 자료, 추가 의견</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>4. 수집 방법</h3>
          <ul>
            <li>이용자가 서비스 화면에서 직접 입력</li>
            <li>이메일을 통한 수신</li>
            <li>접속 시 자동 생성되는 정보의 자동 수집</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제3조 (개인정보의 처리 목적)</h2>
          <p>회사는 수집한 개인정보를 다음 목적에만 사용합니다:</p>
          <ol>
            <li>견적 요청(RFQ) 처리 및 매칭 서비스 제공</li>
            <li>제조업체 정보의 정정·삭제 요청 처리</li>
            <li>이용자 문의 응대 및 고객 지원</li>
            <li>서비스 이용 통계 분석 및 품질 개선 (개인 식별 불가능한 형태)</li>
            <li>법령상 의무 이행</li>
          </ol>
          <p>회사는 위 목적 외 다른 목적으로 개인정보를 사용하지 않으며, 사용 목적이 변경될 경우 사전에 동의를 받습니다.</p>
        </section>

        <section className="legal-section">
          <h2>제4조 (개인정보의 보유 및 이용 기간)</h2>
          <p>회사는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 경우 관련 법령에 따라 일정 기간 보관합니다:</p>
          <ul>
            <li><strong>견적 요청 기록:</strong> 처리 완료 후 3년 (전자상거래법)</li>
            <li><strong>이용자 문의·신고 기록:</strong> 처리 완료 후 3년 (전자상거래법)</li>
            <li><strong>접속 로그:</strong> 3개월 (통신비밀보호법)</li>
            <li><strong>부정 이용 기록:</strong> 1년</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제5조 (제조업체 정보의 출처 및 처리)</h2>
          <p>본 서비스에 표시되는 제조업체 정보는 다음 공개 데이터를 기반으로 합니다:</p>
          <ul>
            <li>공공데이터포털(data.go.kr)에 공개된 공장 등록 정보</li>
            <li>국세청 사업자등록정보 진위확인 및 상태조회 서비스</li>
            <li>금융위원회 기업 기본정보 및 재무정보</li>
            <li>각 지방자치단체가 공개한 공장 정보</li>
          </ul>
          <p>제조업체 정보는 「공공데이터의 제공 및 이용 활성화에 관한 법률」에 따라 공개된 정보이며, B2B 거래 매칭 및 신뢰도 검증 목적으로만 활용됩니다.</p>
          <p>회사는 다음과 같은 정보를 처리하지 않습니다:</p>
          <ul>
            <li>주민등록번호</li>
            <li>개인 휴대폰 번호 (법인 대표 연락처가 아닌 경우)</li>
            <li>대표자 개인 거주지 주소</li>
            <li>기타 개인 식별 가능한 민감 정보</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제6조 (개인정보의 제3자 제공)</h2>
          <p>회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다:</p>
          <ol>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의해 제공이 의무화된 경우</li>
            <li>견적 요청 시 이용자가 선택한 제조업체에 한하여 견적 처리에 필요한 최소한의 정보 제공</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제7조 (개인정보 처리의 위탁)</h2>
          <p>회사는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁할 수 있습니다:</p>
          <ul className="legal-company-info">
            <li><strong>Resend (resend.com):</strong> 이메일 발송 서비스</li>
            <li><strong>Supabase:</strong> 데이터베이스 운영 및 호스팅</li>
            <li><strong>Netlify:</strong> 웹사이트 호스팅 및 서버리스 함수 실행</li>
            <li><strong>Anthropic (anthropic.com):</strong> AI 매칭 분석 서비스</li>
          </ul>
          <p>회사는 위탁 계약 시 개인정보 보호와 관련된 의무를 명시하고, 위탁 업무를 안전하게 관리하기 위해 필요한 사항을 규정합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제8조 (이용자의 권리와 행사 방법)</h2>
          <p>이용자는 다음 권리를 행사할 수 있습니다:</p>
          <ol>
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정·삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>개인정보 처리에 대한 동의 철회</li>
          </ol>
          <p>위 권리 행사는 다음 방법으로 가능합니다:</p>
          <ul>
            <li>사이트 내 정정·삭제 요청 폼 (서비스 내 별도 페이지)</li>
            <li>이메일: <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ul>
          <p>회사는 요청 접수 후 영업일 기준 5일 이내에 처리합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제9조 (제조업체 정보 정정·삭제 요청)</h2>
          <p>본 서비스에 게시된 제조업체 정보의 정정 또는 삭제를 원하는 경우 다음 방법으로 요청할 수 있습니다:</p>
          <ol>
            <li>사이트 내 신고 폼: 별도 페이지에서 신청</li>
            <li>이메일: <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ol>
          <p>요청 시 다음 정보를 포함해주세요:</p>
          <ul>
            <li>회사명 및 사업자등록번호</li>
            <li>요청 사유 (예: 정보 오류, 폐업, 정보 비공개 요청 등)</li>
            <li>요청자 정보 및 권한 증빙 (해당 회사 관계자 확인용)</li>
          </ul>
          <p>회사는 요청 접수 후 영업일 기준 5일 이내 검토하여 처리합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제10조 (개인정보의 안전성 확보 조치)</h2>
          <p>회사는 개인정보 보호를 위해 다음 조치를 시행합니다:</p>
          <ol>
            <li><strong>관리적 조치:</strong> 개인정보 보호 책임자 지정, 정기적인 보안 교육</li>
            <li><strong>기술적 조치:</strong> HTTPS 암호화 통신, 데이터베이스 접근 권한 관리</li>
            <li><strong>물리적 조치:</strong> 위탁 서비스 제공자(Supabase, Netlify 등)의 보안 인증 확인</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제11조 (쿠키의 운영)</h2>
          <p>회사는 서비스 제공을 위해 쿠키(Cookie)를 사용할 수 있습니다.</p>
          <ul>
            <li><strong>사용 목적:</strong> 이용자의 검색 기록 유지, 서비스 이용 분석</li>
            <li><strong>거부 방법:</strong> 브라우저 설정에서 쿠키 저장 거부 가능 (단, 일부 기능 이용 제한 가능)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제12조 (개인정보 보호 책임자)</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 관련 불만 처리 및 피해 구제를 위해 다음과 같이 책임자를 지정합니다:</p>
          <ul className="legal-company-info">
            <li><strong>회사명:</strong> 주식회사 올뷰코리아</li>
            <li><strong>책임자:</strong> 개인정보 보호 담당자</li>
            <li><strong>이메일:</strong> <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제13조 (개인정보 침해 신고)</h2>
          <p>개인정보 침해에 대한 신고나 상담이 필요한 경우 다음 기관에 문의할 수 있습니다:</p>
          <ul>
            <li><strong>개인정보보호 종합지원 포털:</strong> privacy.go.kr / 국번없이 182</li>
            <li><strong>개인정보 분쟁조정위원회:</strong> kopico.go.kr / 1833-6972</li>
            <li><strong>대검찰청 사이버수사과:</strong> spo.go.kr / 02-3480-3573</li>
            <li><strong>경찰청 사이버수사국:</strong> ecrm.cyber.go.kr / 국번없이 182</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제14조 (방침의 변경)</h2>
          <ol>
            <li>본 개인정보처리방침은 시행일로부터 적용됩니다.</li>
            <li>법령, 정책 또는 보안 기술의 변경에 따라 내용 추가·삭제·수정이 있을 시, 사이트 내 공지사항을 통해 사전에 알립니다.</li>
          </ol>
        </section>

        <p className="legal-page-footer">
          본 개인정보처리방침은 2026년 5월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};

// ReportPage — 정정·삭제 요청 / 신고 / 일반 문의
// ──────────────────────────────────────────────────────────
// AI 상담 페이지
// ──────────────────────────────────────────────────────────
const AI_INIT_MSG = { role: 'ai', text: '안녕하세요! 어떤 제품을 만들고 싶으신가요? 편하게 말씀해 주세요.' };

const AiConsultPage = ({ onOpenFactory, authed, onGate, factoryContext }) => {
  const [messages, setMessages] = React.useState(() => {
    const saved = window._aiConsultSession?.messages;
    if (saved && saved.length > 0) return saved;
    return []; // 빈 배열로 시작 - 렌더링 시 표시 메시지 결정
  });
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [factories, setFactories] = React.useState(
    () => window._aiConsultSession?.factories || []
  );
  const [resolvedFactories, setResolvedFactories] = React.useState(
    () => window._aiConsultSession?.resolvedFactories || []
  );
  // factoryContext 변경 감지 - 처음 진입이든 전환이든 메시지 추가
  const prevFactoryIdRef = React.useRef(null); // 항상 null로 시작
  React.useEffect(() => {
    if (!factoryContext) return;
    if (prevFactoryIdRef.current === factoryContext.id) return;
    const isFirst = prevFactoryIdRef.current === null;
    prevFactoryIdRef.current = factoryContext.id;
    const msg = isFirst
      ? { role: 'ai', text: `${factoryContext.name}로 상담을 시작할게요. 어떤 점이 궁금하신가요?` }
      : { role: 'ai', text: `${factoryContext.name}로 변경되어 상담 이어갈게요. 어떤 점이 궁금하신가요?` };
    setMessages(prev => [...prev, msg]);
    if (!isFirst) { setFactories([]); setResolvedFactories([]); }
  }, [factoryContext?.id]);
  const msgsEndRef = React.useRef(null);
  const msgsContainerRef = React.useRef(null);

  // 마운트 시 window 스크롤 잠금 (AI 페이지는 내부 컨테이너만 스크롤)
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // 메시지 변경 시 채팅 컨테이너 안에서만 스크롤 (window 전체 스크롤 방지)
  React.useEffect(() => {
    if (msgsContainerRef.current) {
      msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Fix 2: 상태가 바뀔 때마다 window에 저장
  React.useEffect(() => {
    window._aiConsultSession = { messages, factories, resolvedFactories, factoryContext };
  }, [messages, factories, resolvedFactories]);

  // 매칭된 factory id 목록이 바뀌면 Supabase에서 상세 조회
  React.useEffect(() => {
    if (factories.length === 0) { setResolvedFactories([]); return; }
    const ids = factories.map(f => f.id);
    // 이미 resolvedFactories에 동일 ids가 있으면 재조회 스킵
    const currentIds = resolvedFactories.map(r => r.id).sort().join(',');
    if (currentIds === [...ids].sort().join(',')) return;
    window._sb.from('factories').select('*').in('id', ids)
      .then(({ data }) => {
        if (!data) return;
        const ordered = ids
          .map(id => data.find(r => r.id === id))
          .filter(Boolean)
          .map(r => window._dbRowToFactory(r));
        setResolvedFactories(ordered);
      });
  }, [factories]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    // 비로그인 시 사용자 메시지 3턴 초과하면 게이트 표시
    const userTurnCount = messages.filter(m => m.role === 'user').length;
    if (!authed && userTurnCount >= 3) { onGate?.('ai_consult'); return; }
    window.logVisitor?.('ai_consult', { query: text });
    setInput('');
    const userMsg = { role: 'user', text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    // messages 배열을 Claude API 형식으로 변환
    const apiMessages = nextMessages
      .filter(m => m !== AI_INIT_MSG)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
    const fullApiMessages = [
      { role: 'assistant', content: AI_INIT_MSG.text },
      ...apiMessages,
    ];

    try {
      const resp = await fetch('/.netlify/functions/ai-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: fullApiMessages, factoryContext: factoryContext || null }),
      });
      const data = await resp.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      }
      if (data.matchedFactories && data.matchedFactories.length > 0) {
        setFactories(data.matchedFactories);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="aic-page">
      {/* Fix 3: max-width 1200px 센터링 래퍼 */}
      <div className="aic-inner">
        {/* 좌측: 채팅 */}
        <div className="aic-chat">
          <div className="aic-chat-head">
            <div className="aic-ai-avatar">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.3"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="aic-chat-title">공장매칭 AI 컨설턴트</div>
              <div className="aic-chat-subtitle">제품 정보를 알려주시면 최적의 공장을 찾아드립니다</div>
            </div>
          </div>

          <div className="aic-messages" ref={msgsContainerRef}>
            {(() => {
              // 저장된 메시지 없으면 첫 메시지 결정
              const displayMessages = messages.length > 0 ? messages : [
                factoryContext
                  ? { role: 'ai', text: `${factoryContext.name} 관련해서 궁금하신 점을 말씀해 주세요. 회사 정보 조사, 제품·공정 문의, 유사 제조사 추천까지 도와드리겠습니다.` }
                  : AI_INIT_MSG
              ];
              return displayMessages.map((m, i) => (
                <div key={i} className={`aic-msg ${m.role === 'user' ? 'aic-msg-user' : 'aic-msg-ai'}`}>
                  {m.role === 'ai' && (
                    <div className="aic-msg-avatar">AI</div>
                  )}
                  <div className="aic-msg-bubble">{m.text}</div>
                </div>
              ));
            })()}
            {loading && (
              <div className="aic-msg aic-msg-ai">
                <div className="aic-msg-avatar">AI</div>
                <div className="aic-msg-bubble aic-typing">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={msgsEndRef}/>
          </div>

          <div className="aic-input-row">
            <textarea
              className="aic-input"
              placeholder="제품명, 소재, 수량 등을 입력하세요…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="aic-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="전송"
            >
              <Icon name="arrow_right" size={18} stroke={2.2}/>
            </button>
          </div>
        </div>

        {/* 우측: 통합 패널 */}
        <div className="aic-results">
          <div className="aic-panel-scroll">

            {/* 상담 중인 제조사 - 추천 없으면 크게, 있으면 버튼으로 축소 */}
            {factoryContext && (
              resolvedFactories.length === 0 ? (
                /* 확장 상태 - 상세 내용 표시 */
                <div className="aic-context-expanded">
                  <div className="aic-context-label">
                    <Icon name="buildings" size={13} stroke={2}/>
                    <span>상담 중인 제조사</span>
                  </div>
                  <button className="aic-context-full-card" onClick={() => onOpenFactory?.(factoryContext.id)}>
                    <div className="aic-context-full-thumb" style={{ background: getCardBg(factoryContext) }}>
                      <div className="mcard-img-stripes"/>
                      <div className="aic-context-icon-lg">{getCardIcon(factoryContext)}</div>
                      <div className="aic-context-full-name-overlay">{factoryContext.name}</div>
                    </div>
                    <div className="aic-context-full-body">
                      <div className="aic-context-full-row">
                        <strong className="aic-context-name-lg">{factoryContext.name}</strong>
                      </div>
                      <span className="aic-context-city-lg">
                        <Icon name="pin" size={11} stroke={2}/> {factoryContext.city || ''}
                      </span>
                      {factoryContext.summary && (
                        <p className="aic-context-summary-lg">{factoryContext.summary}</p>
                      )}
                      <span className="aic-context-link">상세페이지 보기 →</span>
                    </div>
                  </button>

                </div>
              ) : (
                /* 축소 상태 - 버튼형태 */
                <button className="aic-context-collapsed" onClick={() => onOpenFactory?.(factoryContext.id)}>
                  <div className="aic-context-mini-thumb" style={{ background: getCardBg(factoryContext) }}>
                    <div className="mcard-img-stripes"/>
                  </div>
                  <div className="aic-context-mini-info">
                    <span className="aic-context-mini-label">상담 중인 제조사</span>
                    <strong className="aic-context-mini-name">{factoryContext.name}</strong>
                  </div>
                  <Icon name="arrow_right" size={14} stroke={2} style={{ flexShrink: 0, color: '#94a3b8' }}/>
                </button>
              )
            )}

            {/* AI 추천 제조사 */}
            <div className={`aic-recommend-wrap${resolvedFactories.length > 0 ? ' has-results' : ''}`}>
              <div className="aic-results-head">
                <Icon name="sparkle" size={16} stroke={1.8}/>
                <span>AI 추천 제조사</span>
                {resolvedFactories.length > 0 && (
                  <span className="aic-results-count">{resolvedFactories.length}곳</span>
                )}
              </div>
              {resolvedFactories.length === 0 ? (
                <div className="aic-results-empty">
                  <div className="aic-empty-icon">
                    <Icon name="search" size={32} stroke={1.2}/>
                  </div>
                  <p>AI와 대화하면<br/>적합한 공장을 찾아드립니다</p>
                </div>
              ) : (
                <div className="aic-cards">
                  {resolvedFactories.map((f) => {
                    const match = factories.find(x => x.id === f.id);
                    return (
                      <div key={f.id} className="aic-card-wrap">
                        {match && (
                          <div className="aic-match-badge">{match.matchPct}% 매칭</div>
                        )}
                        <ManufacturerCard
                          f={f}
                          onOpen={(id) => {
                            if (!window._factoryCache) window._factoryCache = {};
                            window._factoryCache[id] = f;
                            onOpenFactory?.(id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AiConsultPage });

