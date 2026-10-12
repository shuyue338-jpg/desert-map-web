export const fallbackText = {
  zh: '内容待补充',
  en: 'Content pending',
}

export function getText(value, language = 'zh') {
  const fallback = fallbackText[language] || fallbackText.zh
  const otherLanguage = language === 'zh' ? 'en' : 'zh'

  if (typeof value === 'string') {
    return value || fallback
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[language] || value[otherLanguage] || value.zh || value.en || fallback
  }

  return fallback
}

export const uiText = {
  brandKicker: {
    zh: '中国荒漠化治理图集',
    en: 'Desert Restoration Atlas',
  },
  brandTitle: {
    zh: '地图叙事 MVP',
    en: 'Map Narrative MVP',
  },
  nav: {
    Opening: { zh: '开篇', en: 'Opening' },
    'Map Guide': { zh: '地图导览', en: 'Map Guide' },
    Green: { zh: 'Green｜复绿', en: 'Green' },
    Home: { zh: 'Home｜家园', en: 'Home' },
    Land: { zh: 'Land｜土地', en: 'Land' },
    Hope: { zh: 'Hope｜希望', en: 'Hope' },
    Ending: { zh: '结语', en: 'Ending' },
  },
  chapterIntros: {
    Opening: {
      kicker: { zh: '开篇', en: 'Opening' },
      title: { zh: '风从哪里来', en: 'Where does the wind begin?' },
    },
    'Map Guide': {
      kicker: { zh: '地图导览', en: 'Map Guide' },
      title: { zh: '如何阅读这张地图', en: 'How to read this map' },
    },
    Green: {
      kicker: { zh: '第一部分｜复绿', en: 'Part I | Restoring Green' },
      title: { zh: '生命锚点：草木如何扎进沙地', en: 'Life anchors: how vegetation takes root in sand' },
    },
    Home: {
      kicker: { zh: '第二部分｜家园', en: 'Part II | Restoring Home' },
      title: { zh: '沙边人家：人如何与风沙长期相处', en: 'Homes on the edge: living with wind and sand' },
    },
    Land: {
      kicker: { zh: '第三部分｜土地', en: 'Part III | Restoring Land' },
      title: { zh: '土地重新连接', en: 'Reconnecting land systems' },
    },
    Hope: {
      kicker: { zh: '第四部分｜希望', en: 'Part IV | Restoring Hope' },
      title: { zh: '讲给世界听', en: 'Sharing the story with the world' },
    },
    Ending: {
      kicker: { zh: '结语', en: 'Ending' },
      title: { zh: '仍在继续的故事', en: 'A story still in progress' },
    },
  },
  guideIntro: {
    zh: '把这张图集当作分层地图来读：先看案例发生在哪里，再看它关联的主题、历史语境和更大的关系网络。',
    en: 'Use this atlas as a layered map: start with where a case happens, then follow its theme, historical context, and wider connections.',
  },
  guideSteps: [
    {
      id: 'place',
      title: { zh: '按地点阅读', en: 'Read by place' },
      copy: {
        zh: '案例锚定在具体的荒漠化治理地点，从地方边缘延伸到更大的干旱区网络。',
        en: 'Cases are anchored in desertification-control sites, from local edges to wider dryland networks.',
      },
    },
    {
      id: 'theme',
      title: { zh: '按主题阅读', en: 'Read by theme' },
      copy: {
        zh: '每个点位都连接到 Green、Home、Land 或 Hope 中的一条故事线。',
        en: 'Each point connects to one story line: Green, Home, Land, or Hope.',
      },
    },
    {
      id: 'time',
      title: { zh: '按时间语境阅读', en: 'Read by time' },
      copy: {
        zh: '底部时间线提供历史语境，不代表案例的精确发生日期。',
        en: 'The bottom line gives historical context. It is not a chart of exact case dates.',
      },
    },
    {
      id: 'relation',
      title: { zh: '按关系阅读', en: 'Read by relation' },
      copy: {
        zh: '观察生态、生活、治理和传播如何彼此塑造。',
        en: 'Follow how ecology, daily life, governance, and communication shape one another.',
      },
    },
  ],
  guideHint: {
    zh: '悬停查看快速卡片，点击点位打开案例。',
    en: 'Hover over a point for a quick card. Click a point to open the case.',
  },
  narrativePanels: {
    Opening: {
      title: { zh: '开篇叙事', en: 'Opening narrative' },
      copy: {
        zh: '这一部分在进入主题地图之前，先提出图集关注的问题和历史背景。',
        en: 'This opening section frames the atlas question before entering the thematic case map.',
      },
    },
    Ending: {
      title: { zh: '结语叙事', en: 'Closing narrative' },
      copy: {
        zh: '这一部分从地图案例回到仍在继续的荒漠化治理故事。',
        en: 'This closing section returns from mapped cases to the continuing story of desertification control.',
      },
    },
  },
  sectionIntros: {
    Green: {
      title: { zh: 'Restoring Green｜复绿', en: 'Restoring Green' },
      explanation: { zh: '关注生态修复和植被恢复。', en: 'Focus on ecological restoration and vegetation recovery.' },
      bullets: [
        { zh: '植被锚点', en: 'Vegetation anchors' },
        { zh: '修复方法', en: 'Restoration methods' },
        { zh: '生态韧性', en: 'Ecological resilience' },
      ],
    },
    Home: {
      title: { zh: 'Restoring Home｜家园', en: 'Restoring Home' },
      explanation: { zh: '关注社区、生计和人居环境。', en: 'Focus on communities, livelihoods, and lived environments.' },
      bullets: [
        { zh: '社区行动', en: 'Community action' },
        { zh: '生计连接', en: 'Livelihood links' },
        { zh: '日常环境', en: 'Everyday environments' },
      ],
    },
    Land: {
      title: { zh: 'Restoring Land｜土地', en: 'Restoring Land' },
      explanation: { zh: '关注土地系统、工程通道和空间治理。', en: 'Focus on land systems, engineering routes, and spatial governance.' },
      bullets: [
        { zh: '通道与廊道', en: 'Routes and corridors' },
        { zh: '区域系统', en: 'Regional systems' },
        { zh: '长期治理', en: 'Long-term governance' },
      ],
    },
    Hope: {
      title: { zh: 'Restoring Hope｜希望', en: 'Restoring Hope' },
      explanation: { zh: '关注未来合作、全球意义和仍在继续的故事。', en: 'Focus on future cooperation, global relevance, and continuing stories.' },
      bullets: [
        { zh: '知识交流', en: 'Knowledge exchange' },
        { zh: '全球干旱区', en: 'Global drylands' },
        { zh: '持续发生', en: 'Continuing stories' },
      ],
    },
  },
  mapLabels: {
    northwest: { zh: '西北干旱区', en: 'Northwest drylands' },
    north: { zh: '三北走廊', en: 'Three-North corridor' },
    world: { zh: '全球交流案例', en: 'Global exchange cases' },
  },
  detailLabels: {
    atlasCase: { zh: '图集案例', en: 'Atlas Case' },
    location: { zh: '地点', en: 'Location' },
    period: { zh: '时期', en: 'Period' },
    sectionTheme: { zh: '章节 / 主题', en: 'Section / Theme' },
    whyMatters: { zh: '为什么这个案例重要', en: 'Why this case matters' },
    narrativeRole: { zh: '叙事角色', en: 'Narrative role' },
    keyPoints: { zh: '关键词', en: 'Key points' },
    detailNote: { zh: '详细说明', en: 'Detail note' },
    historicalContext: { zh: '历史语境', en: 'Historical Context' },
    sourceStatus: { zh: '来源状态', en: 'Source status' },
    relatedCases: { zh: '相关案例', en: 'Related cases' },
    section: { zh: '章节', en: 'Section' },
  },
  emptyStates: {
    sectionPrompt: { zh: '点击地图点位查看这一章节的具体案例。', en: 'Click a map point to open a case in this section.' },
    sectionIntroHint: { zh: '点击地图点位打开图集案例卡。', en: 'Click a map point to open an atlas case card.' },
    narrativeHint: { zh: '地图点位仍可用于查看相关材料。', en: 'Map points remain available for related materials.' },
  },
  timelineCaption: {
    zh: '时间组提供历史语境，不代表精确事件日期。',
    en: 'Timeline groups provide historical context, not exact event dates.',
  },
  timelineGroups: {
    'Han Dynasty': { zh: '汉代', en: 'Han Dynasty' },
    'Qing Dynasty': { zh: '清代', en: 'Qing Dynasty' },
    'Since 1978': { zh: '1978 年以来', en: 'Since 1978' },
    'Around 2000s': { zh: '约 2000 年代', en: 'Around 2000s' },
    'Around 2020s': { zh: '约 2020 年代', en: 'Around 2020s' },
    '2025+': { zh: '2025 以后', en: '2025+' },
  },
  sourceStatus: {
    'Need source confirmation': { zh: '待来源确认', en: 'Need source confirmation' },
  },
  buttonLabels: {
    switchToEnglish: { zh: 'EN', en: 'EN' },
    switchToChinese: { zh: '中文', en: '中文' },
  },
}
