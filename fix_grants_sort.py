old = open('pages.js', encoding='utf-8').read()

find = """  let displayItems;
  if (statusFilter === 'active') {
    // 진행중: 마감임박 아닌 것 (D-day 제외 7일 초과)
    displayItems = applyFilters(pinnedItems).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && !d.expired && !d.urgent;
    });
  } else if (statusFilter === 'urgent') {
    // 마감임박: D-day 포함 7일 이내
    displayItems = applyFilters(pinnedItems).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && !d.expired && d.urgent;
    });
  } else if (statusFilter === 'closed') {
    // 마감: pinnedItems 외 전체 API 결과에서 마감된 것
    displayItems = applyFilters([...pinnedItems, ...items]).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return !d || d.expired;
    });
    // 중복 제거
    const seen = new Set();
    displayItems = displayItems.filter(item => {
      const key = _biz(item).no || JSON.stringify(item).slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } else {
    // 전체: 진행중+마감임박 상단 고정 + 마감 하단
    const filteredPinned = applyFilters(pinnedItems);
    const allItems = applyFilters([...pinnedItems, ...items]);
    const filteredClosed = allItems.filter(item => {
      const d = calcDday(_biz(item).endDate);
      return !d || d.expired;
    });
    const seen = new Set();
    const deduped = filteredClosed.filter(item => {
      const key = _biz(item).no || JSON.stringify(item).slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (sortBy === 'latest') {
      deduped.sort((a,b) => { const ra=_biz(a).no||'', rb=_biz(b).no||''; return rb>ra?1:rb<ra?-1:0; });
    }
    displayItems = [...filteredPinned, ...deduped];
  }"""

replace = """  // ── 정렬 함수 ──
  const sortItems = (list) => {
    if (sortBy === 'latest') {
      return [...list].sort((a, b) => {
        const ra = _biz(a).no || '', rb = _biz(b).no || '';
        return rb > ra ? 1 : rb < ra ? -1 : 0;
      });
    }
    return [...list].sort((a, b) => {
      const da = calcDday(_biz(a).endDate), db = calcDday(_biz(b).endDate);
      const score = d => {
        if (!d || d.expired) return 9999;
        if (d.label === 'D-day') return 0;
        if (d.urgent) return parseInt(d.label.replace('D-', '')) || 1;
        return 1000 + (parseInt(d.label.replace('D-', '')) || 999);
      };
      return score(da) - score(db);
    });
  };
  const dedupe = (list) => {
    const seen = new Set();
    return list.filter(item => {
      const key = _biz(item).no || JSON.stringify(item).slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  let displayItems;
  if (statusFilter === 'active') {
    displayItems = sortItems(applyFilters(pinnedItems).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && !d.expired && !d.urgent;
    }));
  } else if (statusFilter === 'urgent') {
    displayItems = sortItems(applyFilters(pinnedItems).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && !d.expired && d.urgent;
    }));
  } else if (statusFilter === 'closed') {
    displayItems = sortItems(dedupe(applyFilters([...pinnedItems, ...items]).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return !d || d.expired;
    })));
  } else {
    const filteredPinned = applyFilters(pinnedItems);
    const filteredClosed = dedupe(applyFilters([...pinnedItems, ...items]).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return !d || d.expired;
    }));
    if (sortBy === 'latest') {
      displayItems = sortItems(dedupe([...filteredPinned, ...filteredClosed]));
    } else {
      displayItems = [...sortItems(filteredPinned), ...sortItems(filteredClosed)];
    }
  }"""

if find in old:
    new = old.replace(find, replace)
    open('pages.js', 'w', encoding='utf-8').write(new)
    print('수정 완료')
else:
    print('패턴 못찾음')
