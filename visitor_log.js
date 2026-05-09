/**
 * visitor_log.js
 * 비회원 활동 로그 수집 유틸리티
 * - 로그인 상태에서는 아무것도 하지 않음
 * - session_id는 localStorage에 랜덤 UUID로 저장
 */

(function () {
  function _getSessionId() {
    try {
      let sid = localStorage.getItem('fm-visitor-sid');
      if (!sid) {
        sid = crypto.randomUUID ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = Math.random() * 16 | 0;
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        localStorage.setItem('fm-visitor-sid', sid);
      }
      return sid;
    } catch { return 'anon'; }
  }

  function _isAuthed() {
    try { return localStorage.getItem('fm-authed') === '1'; } catch { return false; }
  }

  /**
   * 비회원 이벤트 로그 기록
   * @param {string} eventType
   * @param {object} [eventData]
   */
  window.logVisitor = function (eventType, eventData) {
    if (_isAuthed()) return;
    if (!window._sb) return;

    const sid = _getSessionId();
    window._sb
      .from('visitor_logs')
      .insert({ session_id: sid, event_type: eventType, event_data: eventData ?? null })
      .then(() => {})
      .catch(() => {});
  };
})();
