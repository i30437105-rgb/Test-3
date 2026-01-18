'use client';
import React, { useState, useEffect } from 'react';

// ============================================
// ИКОНКИ
// ============================================

function LockIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="10" width="14" height="11" rx="2" fill="#FFD54F" stroke="#FFA000" strokeWidth="1.5"/>
      <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" stroke="#FFA000" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="15" r="1.5" fill="#FFA000"/>
    </svg>
  );
}

function TrophyIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8H34V20C34 25.5228 29.5228 30 24 30C18.4772 30 14 25.5228 14 20V8Z" fill="#FFD54F" stroke="#FFA000" strokeWidth="2"/>
      <path d="M14 12H10C8.89543 12 8 12.8954 8 14V16C8 18.7614 10.2386 21 13 21H14" stroke="#FFA000" strokeWidth="2"/>
      <path d="M34 12H38C39.1046 12 40 12.8954 40 14V16C40 18.7614 37.7614 21 35 21H34" stroke="#FFA000" strokeWidth="2"/>
      <rect x="20" y="30" width="8" height="6" fill="#FFD54F"/>
      <rect x="16" y="36" width="16" height="4" rx="1" fill="#FFA000"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ============================================
// ЦВЕТА И КОНСТАНТЫ
// ============================================

const sectionColors = {
  'Стратегия': {
    bg: '#5B9BD5',
    light: '#7BB3E0',
    darker: '#4A8BC5'
  },
  'Лидген': {
    bg: '#ED8936',
    light: '#F6AD55',
    darker: '#DD7926'
  },
  'Продажи': {
    bg: '#48BB78',
    light: '#68D391',
    darker: '#38AB68'
  }
};

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function getEntrepreneursPercent(scorePercent) {
  if (scorePercent <= 30) return 93;
  if (scorePercent <= 60) return 51;
  return 3;
}

function isLevelUnlocked(level, blocks) {
  const blocksBelow = blocks.filter(b => b.level < level);
  return blocksBelow.every(b => b.status === 'success');
}

function generateLevelTooltip(level, blocks, sectionName) {
  if (level === 0) return null;
  
  const redBlocksBelow = blocks
    .filter(b => b.level < level && b.status === 'error')
    .map(b => b.title);
  
  if (redBlocksBelow.length === 0) return null;
  
  return `Для открытия уровня ${level} проработайте блоки раздела «${sectionName}»: ${redBlocksBelow.join(', ')}.`;
}

function generateTrophyTooltip(blocks, sectionName) {
  const redBlocks = blocks
    .filter(b => b.status === 'error')
    .map(b => b.title);
  
  if (redBlocks.length === 0) {
    return `🏆 Поздравляем! Раздел «${sectionName}» полностью проработан!`;
  }
  
  return `Для завершения раздела «${sectionName}» проработайте: ${redBlocks.join(', ')}.`;
}

// ============================================
// UI КОМПОНЕНТЫ
// ============================================

function ResultBlock({ block, isSelected, onClick, isExpanded }) {
  const isSuccess = block.status === 'success';
  const isError = block.status === 'error';
  
  const bgColor = isSuccess 
    ? (isSelected ? '#bbf7d0' : '#dcfce7')
    : isError 
      ? (isSelected ? '#fecaca' : '#fee2e2')
      : '#e5e5e5';
  
  const borderColor = isSuccess
    ? (isSelected ? '#22c55e' : '#86efac')
    : isError
      ? (isSelected ? '#ef4444' : '#fca5a5')
      : '#d4d4d4';
  
  const textColor = isSuccess ? '#166534' : isError ? '#991b1b' : '#525252';
  
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 16px',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        fontFamily: 'inherit',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected 
          ? `0 4px 12px ${isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` 
          : '0 2px 4px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{
        fontSize: '13px',
        fontWeight: 600,
        color: textColor
      }}>
        {block.title}
      </div>
    </button>
  );
}

function BlockDetail({ block, onClose }) {
  const isSuccess = block.status === 'success';
  const recommendation = isSuccess ? block.yes_rec : block.no_rec;
  const statusColor = isSuccess ? '#22c55e' : '#ef4444';
  const statusBg = isSuccess ? '#dcfce7' : '#fee2e2';
  const borderColor = isSuccess ? '#86efac' : '#fca5a5';

  return (
    <div style={{
      background: '#fff',
      borderRadius: '0 0 8px 8px',
      padding: '12px',
      border: `2px solid ${borderColor}`,
      borderTop: 'none',
      marginTop: '-2px',
      position: 'relative',
      zIndex: 0
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#888',
          padding: '4px'
        }}
      >
        <CloseIcon />
      </button>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: statusBg,
        borderRadius: '100px',
        marginBottom: '10px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: statusColor
        }} />
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: statusColor
        }}>
          {isSuccess ? 'Зелёная зона' : 'Красная зона'}
        </span>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#444',
        lineHeight: 1.6
      }}>
        {recommendation}
      </div>
    </div>
  );
}

function DesktopDetailPanel({ block, onClose }) {
  if (!block) return null;

  const isSuccess = block.status === 'success';
  const recommendation = isSuccess ? block.yes_rec : block.no_rec;
  const statusColor = isSuccess ? '#22c55e' : '#ef4444';
  const statusBg = isSuccess ? '#dcfce7' : '#fee2e2';

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '-8px',
      marginBottom: '16px',
      border: '1px solid #e5e5e5',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: '#f5f5f5',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CloseIcon />
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
        flexWrap: 'wrap'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#333',
          margin: 0
        }}>
          {block.title}
        </h3>
        <span style={{
          padding: '4px 12px',
          background: statusBg,
          color: statusColor,
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: 600
        }}>
          {isSuccess ? 'Зелёная зона' : 'Красная зона'}
        </span>
      </div>

      <div style={{
        fontSize: '14px',
        color: '#444',
        lineHeight: 1.6,
        padding: '16px',
        background: statusBg,
        borderRadius: '8px',
        border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`
      }}>
        {recommendation}
      </div>
    </div>
  );
}

function LevelBadge({ level, variant = 'default', tooltipText }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const colors = {
    'default': { bg: '#4a5568', text: '#fff' },
    'start': { bg: '#68D391', text: '#22543d' }
  };
  const color = colors[variant];
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => tooltipText && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        background: color.bg,
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        color: color.text,
        cursor: tooltipText ? 'help' : 'default',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {variant !== 'start' && <LockIcon size={16} />}
        Уровень {level}
      </div>
      
      {showTooltip && tooltipText && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px',
          padding: '12px 16px',
          background: '#1a202c',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '12px',
          lineHeight: 1.5,
          width: '280px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 100,
          textAlign: 'left'
        }}>
          {tooltipText}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #1a202c'
          }} />
        </div>
      )}
    </div>
  );
}

function TrophyWithTooltip({ tooltipText }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block', cursor: 'help' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <TrophyIcon size={48} />
      
      {showTooltip && tooltipText && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px',
          padding: '12px 16px',
          background: '#1a202c',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '12px',
          lineHeight: 1.5,
          width: '280px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 100,
          textAlign: 'left'
        }}>
          {tooltipText}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #1a202c'
          }} />
        </div>
      )}
    </div>
  );
}

function SectionStats({ blocks, sectionName }) {
  const totalGreen = blocks.filter(b => b.status === 'success').length;
  const totalRed = blocks.filter(b => b.status === 'error').length;
  const total = blocks.length;
  const percent = Math.round((totalGreen / total) * 100);
  const entrepreneursPercent = getEntrepreneursPercent(percent);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          {percent}%
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'right'
        }}>
          <span style={{ color: '#bbf7d0', fontWeight: 600 }}>{totalGreen}</span>
          <span> / </span>
          <span style={{ color: '#fecaca', fontWeight: 600 }}>{totalRed}</span>
          <span> из {total}</span>
        </div>
      </div>
      <div style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1.4
      }}>
        Такой результат у <strong>{entrepreneursPercent}%</strong> предпринимателей России
      </div>
    </div>
  );
}

// ============================================
// ДОРОЖКИ СЕКЦИЙ
// ============================================

function SectionTrackHorizontal({ section, blocks, selectedBlock, onSelectBlock, sectionKey, onDeselectBlock }) {
  const colors = sectionColors[sectionKey];
  
  const blocksByLevel = {};
  blocks.forEach(block => {
    if (!blocksByLevel[block.level]) {
      blocksByLevel[block.level] = [];
    }
    blocksByLevel[block.level].push(block);
  });
  
  const levels = Object.keys(blocksByLevel).map(Number).sort((a, b) => a - b);
  const selectedInSection = selectedBlock && blocks.find(b => b.id === selectedBlock.id);
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.light} 100%)`,
        borderRadius: selectedInSection ? '16px 16px 0 0' : '16px',
        padding: '24px 32px 36px',
        position: 'relative',
        overflow: 'visible'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <SectionStats blocks={blocks} sectionName={section} />
          <h3 style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
            margin: 0
          }}>
            {section}
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '100px',
            right: '80px',
            height: '4px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '2px',
            zIndex: 0
          }} />
          
          {levels.map((level, levelIndex) => {
            const levelUnlocked = isLevelUnlocked(level, blocks);
            const tooltipText = generateLevelTooltip(level, blocks, section);
            
            return (
              <React.Fragment key={level}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '200px',
                  flex: '1',
                  paddingBottom: '44px',
                  position: 'relative'
                }}>
                  {blocksByLevel[level].length > 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '14px',
                      bottom: '60px',
                      width: '3px',
                      background: 'rgba(255,255,255,0.35)',
                      transform: 'translateX(-50%)',
                      zIndex: 0,
                      borderRadius: '2px'
                    }} />
                  )}
                  
                  {blocksByLevel[level].map((block) => (
                    <ResultBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      onClick={() => {
                        if (selectedBlock?.id === block.id) {
                          onDeselectBlock();
                        } else {
                          onSelectBlock(block);
                        }
                      }}
                    />
                  ))}
                  
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '28px',
                    height: '16px',
                    width: '3px',
                    background: 'rgba(255,255,255,0.5)',
                    transform: 'translateX(-50%)',
                    borderRadius: '2px'
                  }} />
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  minWidth: '110px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <LevelBadge 
                    level={level} 
                    variant={levelUnlocked ? 'start' : 'default'}
                    tooltipText={tooltipText}
                  />
                </div>
              </React.Fragment>
            );
          })}
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            minWidth: '70px',
            position: 'relative',
            zIndex: 2
          }}>
            <TrophyWithTooltip tooltipText={generateTrophyTooltip(blocks, section)} />
          </div>
        </div>
      </div>
      
      {selectedInSection && (
        <DesktopDetailPanel 
          block={selectedInSection} 
          onClose={onDeselectBlock}
        />
      )}
    </div>
  );
}

function SectionTrackVertical({ section, blocks, selectedBlock, onSelectBlock, sectionKey, onDeselectBlock }) {
  const colors = sectionColors[sectionKey];
  
  const blocksByLevel = {};
  blocks.forEach(block => {
    if (!blocksByLevel[block.level]) {
      blocksByLevel[block.level] = [];
    }
    blocksByLevel[block.level].push(block);
  });
  
  const levels = Object.keys(blocksByLevel).map(Number).sort((a, b) => b - a);
  
  return (
    <div style={{
      background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.light} 100%)`,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <h3 style={{
        color: 'rgba(255,255,255,0.95)',
        fontSize: '13px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '12px',
        textAlign: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.15)'
      }}>
        {section}
      </h3>
      
      <SectionStats blocks={blocks} sectionName={section} />
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 2
      }}>
        <TrophyWithTooltip tooltipText={generateTrophyTooltip(blocks, section)} />
      </div>
      
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '180px',
        bottom: '50px',
        width: '3px',
        background: 'rgba(255,255,255,0.4)',
        transform: 'translateX(-50%)',
        zIndex: 0,
        borderRadius: '2px'
      }} />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        {levels.map((level) => {
          const levelUnlocked = isLevelUnlocked(level, blocks);
          const tooltipText = generateLevelTooltip(level, blocks, section);
          
          return (
            <React.Fragment key={level}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%',
                maxWidth: '300px'
              }}>
                {blocksByLevel[level].map(block => {
                  const isExpanded = selectedBlock?.id === block.id;
                  return (
                    <div key={block.id}>
                      <ResultBlock
                        block={block}
                        isSelected={isExpanded}
                        isExpanded={isExpanded}
                        onClick={() => {
                          if (isExpanded) {
                            onDeselectBlock();
                          } else {
                            onSelectBlock(block);
                          }
                        }}
                      />
                      {isExpanded && (
                        <BlockDetail 
                          block={block} 
                          onClose={onDeselectBlock}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 0',
                position: 'relative',
                zIndex: 2
              }}>
                <LevelBadge 
                  level={level} 
                  variant={levelUnlocked ? 'start' : 'default'}
                  tooltipText={tooltipText}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ
// ============================================

function PersonalRecommendations({ results }) {
  const allRedBlocks = [];
  ['Стратегия', 'Лидген', 'Продажи'].forEach(section => {
    results.sections[section].blocks
      .filter(b => b.status === 'error')
      .forEach(b => allRedBlocks.push({ ...b, sectionName: section }));
  });

  allRedBlocks.sort((a, b) => a.level - b.level);

  const totalBlocks = Object.values(results.sections).reduce((sum, s) => sum + s.blocks.length, 0);
  const totalGreen = Object.values(results.sections).reduce((sum, s) => sum + s.totalGreen, 0);
  const overallPercent = Math.round((totalGreen / totalBlocks) * 100);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '8px',
      border: '1px solid #e5e5e5',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🎯
        </div>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#333',
            margin: 0
          }}>
            Персональные рекомендации
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#888',
            margin: '4px 0 0 0'
          }}>
            На основе результатов вашего аудита
          </p>
        </div>
      </div>

      <div style={{
        background: overallPercent >= 60 ? '#dcfce7' : overallPercent >= 30 ? '#fef3c7' : '#fee2e2',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: overallPercent >= 60 ? '#166534' : overallPercent >= 30 ? '#92400e' : '#991b1b',
            marginBottom: '4px'
          }}>
            Общий результат: {overallPercent}%
          </div>
          <div style={{
            fontSize: '13px',
            color: overallPercent >= 60 ? '#166534' : overallPercent >= 30 ? '#92400e' : '#991b1b',
            opacity: 0.8
          }}>
            {totalGreen} из {totalBlocks} блоков в зелёной зоне
          </div>
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: 800,
          color: overallPercent >= 60 ? '#22c55e' : overallPercent >= 30 ? '#f59e0b' : '#ef4444'
        }}>
          {overallPercent}%
        </div>
      </div>

      {allRedBlocks.length > 0 ? (
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#333',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#ef4444' }}>●</span>
            Приоритетные задачи ({allRedBlocks.length})
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {allRedBlocks.slice(0, 5).map((block, idx) => (
              <div key={block.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#333'
                  }}>
                    {block.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#888',
                    marginTop: '2px'
                  }}>
                    {block.sectionName} · Уровень {block.level}
                  </div>
                </div>
              </div>
            ))}
            {allRedBlocks.length > 5 && (
              <div style={{
                fontSize: '12px',
                color: '#888',
                textAlign: 'center',
                padding: '8px'
              }}>
                И ещё {allRedBlocks.length - 5} задач...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: '#dcfce7',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#166534'
          }}>
            Отличный результат!
          </div>
          <div style={{
            fontSize: '13px',
            color: '#166534',
            marginTop: '4px'
          }}>
            Все блоки в зелёной зоне. Ваш маркетинг работает системно.
          </div>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
        borderRadius: '12px',
        border: '1px dashed #c7d2fe',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '13px',
          color: '#6366f1',
          fontWeight: 500
        }}>
          🚀 Скоро здесь появятся персонализированные рекомендации на основе AI-анализа
        </div>
      </div>
    </div>
  );
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================

export function ResultsScreen({ results, onRestart }) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDeselectBlock = () => setSelectedBlock(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <header style={{
        padding: '20px 24px',
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#888',
            letterSpacing: '1px',
            marginBottom: '4px'
          }}>
            РЕЗУЛЬТАТЫ АУДИТА
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#333',
            margin: 0
          }}>
            Маркетинг-Аудит · Method Dobrusin
          </h1>
        </div>

        {onRestart && (
          <button
            onClick={onRestart}
            style={{
              padding: '10px 20px',
              background: '#4299e1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#3182ce';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#4299e1';
            }}
          >
            Пройти заново
          </button>
        )}
      </header>

      <main style={{
        padding: isMobile ? '16px' : '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4299e1'
          }} />
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Нажмите на любой блок, чтобы увидеть детальную рекомендацию
          </p>
        </div>

        {['Стратегия', 'Лидген', 'Продажи'].map(section => (
          isMobile ? (
            <SectionTrackVertical
              key={section}
              section={section === 'Стратегия' ? 'СТРАТЕГИЧЕСКИЙ МАРКЕТИНГ' : 
                       section === 'Лидген' ? 'ГЕНЕРАЦИЯ ЛИДОВ' : 'ПРОДАЖИ'}
              sectionKey={section}
              blocks={results.sections[section].blocks}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              onDeselectBlock={handleDeselectBlock}
            />
          ) : (
            <SectionTrackHorizontal
              key={section}
              section={section === 'Стратегия' ? 'СТРАТЕГИЧЕСКИЙ МАРКЕТИНГ' : 
                       section === 'Лидген' ? 'ГЕНЕРАЦИЯ ЛИДОВ' : 'ПРОДАЖИ'}
              sectionKey={section}
              blocks={results.sections[section].blocks}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              onDeselectBlock={handleDeselectBlock}
            />
          )
        ))}

        <PersonalRecommendations results={results} />
      </main>
    </div>
  );
}
