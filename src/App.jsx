import { useEffect, useMemo, useRef, useState } from 'react'
import { divIcon, latLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import './App.css'
import { getText, uiText } from './i18n/uiText'

const CHAPTERS = [
  'Opening',
  'Map Guide',
  'Green',
  'Home',
  'Land',
  'Hope',
  'Ending',
]

const THEME_COLORS = {
  Opening: '#B88A4A',
  'Map Guide': '#64748B',
  Green: 'var(--color-section-green)',
  Home: 'var(--color-section-home)',
  Land: 'var(--color-section-land)',
  Hope: 'var(--color-section-hope)',
  Ending: '#8B5CF6',
}

const GUIDE_THEMES = ['Green', 'Home', 'Land', 'Hope']

const HISTORY_TIMELINE = [
  {
    id: 'han',
    smallLabel: 'Han Dynasty',
    mood: 'sandrise',
    narrative: '风沙先成为边地生活的一部分，人们开始学习如何辨认水、土、草木与生存边界。',
  },
  {
    id: 'qing',
    smallLabel: 'Qing Dynasty',
    mood: 'straw',
    narrative: '民间固沙经验慢慢沉淀，草墙与压草办法为后来的草方格留下历史伏笔。',
  },
  {
    id: 'y1978',
    smallLabel: 'Since 1978',
    mood: 'shelterbelt',
    narrative: '分散的地方实践被纳入更长尺度的国家工程，防护林带开始回应北方风沙。',
  },
  {
    id: 'y2000',
    smallLabel: 'Around 2000s',
    mood: 'campaign',
    narrative: '道路、绿洲、林草和社区行动交织在一起，治沙从点位推进到区域治理。',
  },
  {
    id: 'y2020',
    smallLabel: 'Around 2020s',
    mood: 'edge',
    narrative: '治理视角转向沙漠边缘与生态屏障，重点从穿越流沙扩展到稳住边界。',
  },
  {
    id: 'y2025',
    smallLabel: '2025+',
    mood: 'global',
    narrative: '中国治沙经验进入更多干旱区对话，成为可以比较、调适和共同学习的方法。',
  },
]

const TIMELINE_GROUP_TO_STAGE = {
  'Han Dynasty': 'han',
  'Qing Dynasty': 'qing',
  'Since 1978': 'y1978',
  'Around 2000s': 'y2000',
  'Around 2020s': 'y2020',
  '2025+': 'y2025',
}

function getTag(item) {
  const keywords = item.keywords || item.tags
  return Array.isArray(keywords) && keywords.length > 0 ? keywords[0] : item.caseType || item.type || item.theme
}

function getSectionColor(item) {
  return THEME_COLORS[item.section] || THEME_COLORS[item.theme] || THEME_COLORS['Map Guide']
}

function inferTimelineStage(item) {
  const id = String(item.id || '').toLowerCase()
  const title = String(item.title || '')

  if (TIMELINE_GROUP_TO_STAGE[item.timelineGroup]) {
    return TIMELINE_GROUP_TO_STAGE[item.timelineGroup]
  }

  if (id.includes('juyan') || title.includes('汉代') || title.includes('居延')) {
    return 'han'
  }

  if (id.includes('minqin') || title.includes('清代') || title.includes('柴草墙')) {
    return 'qing'
  }

  if (item.timelineStage) {
    return item.timelineStage
  }

  if (item.theme === 'Hope' || item.theme === 'Ending') {
    return 'y2025'
  }

  if (
    id.includes('three-north') ||
    id.includes('straw') ||
    title.includes('三北工程') ||
    title.includes('草方格')
  ) {
    return 'y1978'
  }

  if (
    id.includes('edge') ||
    id.includes('kubuqi') ||
    id.includes('highway') ||
    id.includes('railway') ||
    id.includes('shapotou') ||
    id.includes('taklimakan') ||
    title.includes('锁边') ||
    title.includes('库布其') ||
    title.includes('公路') ||
    title.includes('铁路') ||
    title.includes('沙坡头') ||
    title.includes('塔克拉玛干')
  ) {
    return 'y2020'
  }

  if (item.theme === 'Green' || item.theme === 'Home') {
    return 'y2000'
  }

  return 'y2000'
}

function getTimelineGroup(item) {
  if (item.timelineGroup) {
    return item.timelineGroup
  }

  const stageId = inferTimelineStage(item)
  return HISTORY_TIMELINE.find((timeline) => timeline.id === stageId)?.smallLabel || HISTORY_TIMELINE[0].smallLabel
}

function getFieldValue(value, language) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : [getText(null, language)]
  }
  return getText(value, language)
}

function getCaseCoordinates(item) {
  const lng = Number(item.coordinates?.lng ?? item.lng)
  const lat = Number(item.coordinates?.lat ?? item.lat)
  return Number.isFinite(lng) && Number.isFinite(lat) ? [lat, lng] : null
}

function getMarkerIcon(color, isSelected, isHovered) {
  const stateClass = isSelected ? 'is-selected' : isHovered ? 'is-hovered' : ''

  return divIcon({
    className: 'leaflet-marker-shell',
    html: `
      <span class="leaflet-section-marker ${stateClass}" style="--marker-color: ${color}">
        <span class="leaflet-marker-halo"></span>
        <span class="leaflet-marker-core"></span>
      </span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function MapSizeController({ watchKey }) {
  const map = useMap()

  useEffect(() => {
    map.zoomControl?.remove()
    const invalidate = () => map.invalidateSize({ animate: false })
    const timer = window.setTimeout(invalidate, 100)
    const frame = window.requestAnimationFrame(invalidate)
    const container = map.getContainer()
    const observer = new ResizeObserver(invalidate)

    observer.observe(container)
    if (container.parentElement) {
      observer.observe(container.parentElement)
    }

    return () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [map, watchKey])

  return null
}

function isNorthernChinaPosition(position) {
  const [lat, lng] = position
  return lng >= 73 && lng <= 124 && lat >= 30 && lat <= 50
}

function MapBoundsController({ cases, activeSection, selectedCase }) {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize({ animate: false })

    if (selectedCase) {
      const selectedPosition = getCaseCoordinates(selectedCase)
      if (selectedPosition) {
        map.setView(selectedPosition, 5, { animate: false })
      }
      return
    }

    const positions = cases.map(getCaseCoordinates).filter(Boolean)

    if (positions.length === 0) {
      map.setView([39, 105], 4, { animate: false })
      return
    }

    const northernChinaPositions = positions.filter(isNorthernChinaPosition)
    const focusPositions =
      activeSection === 'Map Guide' && northernChinaPositions.length >= 2 ? northernChinaPositions : positions

    if (focusPositions.length === 1) {
      map.setView(focusPositions[0], 5, { animate: false })
      return
    }

    map.fitBounds(latLngBounds(focusPositions), {
      animate: false,
      maxZoom: 6,
      padding: [42, 42],
    })
  }, [activeSection, cases, map, selectedCase])

  return null
}

function getSourceStatus(value, language) {
  return getText(uiText.sourceStatus[value] || value, language)
}

function App() {
  const [cases, setCases] = useState([])
  const [language, setLanguage] = useState('zh')
  const [activeSection, setActiveSection] = useState('Map Guide')
  const [selectedCase, setSelectedCase] = useState(null)
  const [hoveredCase, setHoveredCase] = useState(null)
  const [activeTimelineGroup, setActiveTimelineGroup] = useState(HISTORY_TIMELINE[0].smallLabel)
  const [isLoading, setIsLoading] = useState(true)
  const guideDialog = useRef(null)

  useEffect(() => {
    let isMounted = true

    fetch('/data/cases.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load cases.json')
        }
        return response.json()
      })
      .then((data) => {
        if (!isMounted) return
        setCases(data)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleCases = useMemo(() => {
    if (activeSection === 'Map Guide') {
      return cases.filter((item) => item.showInMapGuide !== false)
    }
    if (activeSection === 'Opening' || activeSection === 'Ending') {
      return cases.filter((item) => item.theme === activeSection)
    }
    return cases.filter((item) => item.section === activeSection)
  }, [activeSection, cases])

  const activeTimeline = useMemo(
    () => HISTORY_TIMELINE.find((item) => item.smallLabel === activeTimelineGroup) || HISTORY_TIMELINE[0],
    [activeTimelineGroup],
  )

  const selectedCaseStage = useMemo(() => {
    if (!selectedCase) return null
    const timelineGroup = getTimelineGroup(selectedCase)
    return HISTORY_TIMELINE.find((item) => item.smallLabel === timelineGroup) || null
  }, [selectedCase])

  const visibleTimelineGroups = useMemo(
    () => new Set(visibleCases.map((item) => getTimelineGroup(item))),
    [visibleCases],
  )

  const sectionKeywords = useMemo(() => {
    const keywords = visibleCases.flatMap((item) => item.keywords || item.tags || [])
    return [...new Set(keywords)].slice(0, 6)
  }, [visibleCases])

  const chapterIntro = uiText.chapterIntros[activeSection]

  const counts = useMemo(
    () =>
      CHAPTERS.reduce((acc, chapter) => {
        acc[chapter] =
          chapter === 'Map Guide'
            ? cases.filter((item) => item.showInMapGuide !== false).length
            : chapter === 'Opening' || chapter === 'Ending'
              ? cases.filter((item) => item.theme === chapter).length
              : cases.filter((item) => item.section === chapter).length
        return acc
      }, {}),
    [cases],
  )

  function handleSectionChange(section) {
    setActiveSection(section)
    setSelectedCase(null)
    setHoveredCase(null)
  }

  function handleCaseSelect(item) {
    setSelectedCase(item)
    setActiveTimelineGroup(getTimelineGroup(item))
  }

  return (
    <main className={`atlas-shell timeline-mood-${activeTimeline.mood}`}>
      <nav className="top-nav" aria-label="Story chapters">
        <div className="brand-block">
          <span className="brand-kicker">{getText(uiText.brandKicker, language)}</span>
          <strong>{getText(uiText.brandTitle, language)}</strong>
        </div>

        <div className="chapter-nav">
          {CHAPTERS.filter((chapter) => chapter !== 'Map Guide').map((chapter) => (
            <button
              type="button"
              key={chapter}
              className={chapter === activeSection ? 'is-active' : ''}
              onClick={() => handleSectionChange(chapter)}
            >
              <span>{getText(uiText.nav[chapter], language)}</span>
              <small>{counts[chapter] || 0}</small>
            </button>
          ))}
        </div>
        <div className="nav-tools">
          <button
            type="button"
            className="guide-toggle"
            aria-haspopup="dialog"
            onClick={() => guideDialog.current.showModal()}
          >
            {getText(uiText.nav['Map Guide'], language)}
          </button>
          <button
            type="button"
            className="language-toggle"
            onClick={() => setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))}
          >
            {language === 'zh'
              ? getText(uiText.buttonLabels.switchToEnglish, language)
              : getText(uiText.buttonLabels.switchToChinese, language)}
          </button>
        </div>
      </nav>

      <section
        className={`map-stage ${selectedCase ? 'has-selected-case' : activeSection === 'Map Guide' ? 'has-map-overview' : 'has-intro-panel'}`}
        aria-label="Interactive case map"
      >
        <div className="map-canvas">
          <MapContainer className="real-map" center={[39, 105]} zoom={4} minZoom={2} maxZoom={8} scrollWheelZoom zoomControl={false}>
            <ZoomControl position="topright" />
            <TileLayer
              attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <MapSizeController watchKey={`${activeSection}-${selectedCase?.id || 'none'}`} />
            <MapBoundsController cases={visibleCases} activeSection={activeSection} selectedCase={selectedCase} />

            {visibleCases.map((item) => {
              const position = getCaseCoordinates(item)
              if (!position) return null

              const isSelected = selectedCase?.id === item.id
              const isHovered = hoveredCase?.id === item.id
              const color = getSectionColor(item)

              return (
                <Marker
                  key={item.id}
                  position={position}
                  icon={getMarkerIcon(color, isSelected, isHovered)}
                  eventHandlers={{
                    mouseover: () => setHoveredCase(item),
                    mouseout: () => setHoveredCase(null),
                    click: () => handleCaseSelect(item),
                  }}
                >
                  <Tooltip
                    className="marker-tooltip"
                    direction="top"
                    offset={[0, -14]}
                    opacity={1}
                    permanent={isSelected}
                  >
                    <strong>{getText(item.title, language)}</strong>
                    <span>{getText(item.subtitle, language)}</span>
                    <em>{getText(getTag(item), language)}</em>
                  </Tooltip>
                </Marker>
              )
            })}
          </MapContainer>

          {activeSection !== 'Map Guide' && <div className="chapter-intro map-chapter-intro">
            <span>{getText(chapterIntro.kicker, language)}</span>
            <strong>{getText(chapterIntro.title, language)}</strong>
          </div>}

          {isLoading && <div className="loading-note">Loading case data...</div>}
        </div>

        {(selectedCase || activeSection !== 'Map Guide') && <aside className="info-panel">
          {selectedCase ? (
            <>
              <div className="case-card-header">
                <div className="panel-heading">
                  <span
                    className="theme-dot"
                    style={{ background: getSectionColor(selectedCase) }}
                  />
                  <p>{getText(uiText.detailLabels.atlasCase, language)}</p>
                </div>
                <h1>{getFieldValue(selectedCase.title, language)}</h1>
              </div>

              <div className="case-facts" aria-label="Case facts">
                <div>
                  <span>{getText(uiText.detailLabels.location, language)}</span>
                  <strong>{getFieldValue(selectedCase.location, language)}</strong>
                </div>
                <div>
                  <span>{getText(uiText.detailLabels.period, language)}</span>
                  <strong>{getFieldValue(selectedCase.period, language)}</strong>
                </div>
                <div>
                  <span>{getText(uiText.detailLabels.sectionTheme, language)}</span>
                  <strong>
                    {getText(uiText.nav[selectedCase.section] || selectedCase.section, language)} /{' '}
                    {getText(uiText.nav[selectedCase.theme] || selectedCase.theme, language)}
                  </strong>
                </div>
              </div>

              <section className="case-section">
                <span>{getText(uiText.detailLabels.whyMatters, language)}</span>
                <p>{getFieldValue(selectedCase.shortSummary || selectedCase.summary, language)}</p>
              </section>

              <section className="case-section">
                <span>{getText(uiText.detailLabels.narrativeRole, language)}</span>
                <p>{getFieldValue(selectedCase.narrativeRole || selectedCase.storyAngle, language)}</p>
              </section>

              <section className="case-section">
                <span>{getText(uiText.detailLabels.keyPoints, language)}</span>
                <div className="keyword-list">
                  {getFieldValue(selectedCase.keywords || selectedCase.tags, language).map((keyword, index) => (
                    <em key={`${getText(keyword, language)}-${index}`}>{getText(keyword, language)}</em>
                  ))}
                </div>
              </section>

              <section className="case-section">
                <span>{getText(uiText.detailLabels.detailNote, language)}</span>
                <p>{getFieldValue(selectedCase.detailSummary || selectedCase.content, language)}</p>
              </section>

              <div className="case-footer">
                {selectedCaseStage && (
                  <div>
                    <span>{getText(uiText.detailLabels.historicalContext, language)}</span>
                    <strong>{getText(uiText.timelineGroups[selectedCaseStage.smallLabel], language)}</strong>
                  </div>
                )}
                <div>
                  <span>{getText(uiText.detailLabels.sourceStatus, language)}</span>
                  <strong>{getSourceStatus(selectedCase.sourceStatus, language)}</strong>
                </div>
              </div>
            </>
          ) : activeSection === 'Opening' || activeSection === 'Ending' ? (
            <div className="guide-panel">
              <div className="chapter-intro panel-chapter-intro">
                <span>{getText(chapterIntro.kicker, language)}</span>
                <strong>{getText(chapterIntro.title, language)}</strong>
              </div>
              <section className="guide-item">
                <div className="panel-heading">
                  <span className="theme-dot" style={{ background: THEME_COLORS[activeSection] }} />
                  <p>{getText(uiText.narrativePanels[activeSection].title, language)}</p>
                </div>
                <p>{getText(uiText.narrativePanels[activeSection].copy, language)}</p>
              </section>
              {visibleCases.length > 0 && (
                <p className="guide-hint">{getText(uiText.emptyStates.narrativeHint, language)}</p>
              )}
            </div>
          ) : uiText.sectionIntros[activeSection] ? (
            <div className="section-intro-panel">
              <div className="chapter-intro panel-chapter-intro">
                <span>{getText(chapterIntro.kicker, language)}</span>
                <strong>{getText(chapterIntro.title, language)}</strong>
              </div>
              <section className="section-intro-card">
                <div className="panel-heading">
                  <span className="theme-dot" style={{ background: THEME_COLORS[activeSection] }} />
                  <p>{getText(uiText.sectionIntros[activeSection].title, language)}</p>
                </div>
                <p className="section-intro-copy">
                  {getText(uiText.sectionIntros[activeSection].explanation, language)}
                </p>
                <ul className="section-bullets">
                  {uiText.sectionIntros[activeSection].bullets.map((bullet, index) => (
                    <li key={`${getText(bullet, language)}-${index}`}>{getText(bullet, language)}</li>
                  ))}
                </ul>
              </section>
              <div className="section-stats">
                <div>
                  <span>{getText(uiText.detailLabels.relatedCases, language)}</span>
                  <strong>{visibleCases.length}</strong>
                </div>
                <div>
                  <span>{getText(uiText.detailLabels.section, language)}</span>
                  <strong>{getText(uiText.nav[activeSection], language)}</strong>
                </div>
              </div>
              {sectionKeywords.length > 0 && (
                <div className="keyword-list">
                  {sectionKeywords.map((keyword, index) => (
                    <em key={`${getText(keyword, language)}-${index}`}>{getText(keyword, language)}</em>
                  ))}
                </div>
              )}
              <p className="guide-hint">{getText(uiText.emptyStates.sectionIntroHint, language)}</p>
            </div>
          ) : (
            <div>
              <div className="chapter-intro panel-chapter-intro">
                <span>{getText(chapterIntro.kicker, language)}</span>
                <strong>{getText(chapterIntro.title, language)}</strong>
              </div>
              <p className="empty-state">{getText(uiText.emptyStates.sectionPrompt, language)}</p>
            </div>
          )}
        </aside>}
      </section>

      <dialog
        ref={guideDialog}
        className="guide-dialog"
        aria-labelledby="guide-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect()
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
              event.currentTarget.close()
            }
          }
        }}
      >
        <header className="guide-dialog-header">
          <div className="chapter-intro">
            <span>{getText(uiText.chapterIntros['Map Guide'].kicker, language)}</span>
            <strong id="guide-dialog-title">{getText(uiText.chapterIntros['Map Guide'].title, language)}</strong>
          </div>
          <button
            type="button"
            className="guide-close"
            aria-label={language === 'zh' ? '关闭导览' : 'Close guide'}
            title={language === 'zh' ? '关闭导览' : 'Close guide'}
            onClick={() => guideDialog.current.close()}
          >
            &times;
          </button>
        </header>
        <p className="guide-copy">{getText(uiText.guideIntro, language)}</p>
        <div className="guide-list">
          {uiText.guideSteps.map((item) => (
            <section key={item.id} className="guide-item">
              <div className="panel-heading">
                <span className="theme-dot" style={{ background: THEME_COLORS['Map Guide'] }} />
                <p>{getText(item.title, language)}</p>
              </div>
              <p>{getText(item.copy, language)}</p>
            </section>
          ))}
        </div>
        <div className="legend-block" aria-label="Theme color legend">
          {GUIDE_THEMES.map((theme) => (
            <span key={theme}>
              <i style={{ background: THEME_COLORS[theme] }} />
              {getText(uiText.nav[theme], language)}
            </span>
          ))}
        </div>
        <p className="guide-hint">{getText(uiText.guideHint, language)}</p>
      </dialog>

      <footer className="timeline" aria-label="Story timeline">
        <p className="timeline-caption">{getText(uiText.timelineCaption, language)}</p>
        <div className="timeline-track">
          {HISTORY_TIMELINE.map((item) => (
            <button
              type="button"
              key={item.id}
              className={[
                item.smallLabel === activeTimelineGroup ? 'is-active' : '',
                !selectedCase && visibleTimelineGroups.has(item.smallLabel) ? 'is-contextual' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setActiveTimelineGroup(item.smallLabel)}
            >
              <span className="timeline-node" />
              <span className="timeline-label">
                <strong>{getText(uiText.timelineGroups[item.smallLabel], language)}</strong>
              </span>
            </button>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default App
