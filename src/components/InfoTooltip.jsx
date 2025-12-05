import React, { useState } from 'react';

const InfoTooltip = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="info-tooltip"
            style={{ position: 'relative', display: 'inline-block', marginLeft: '8px' }}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={(e) => {
                e.stopPropagation();
                setIsVisible(!isVisible);
            }}
        >
            <span
                style={{
                    cursor: 'help',
                    fontSize: '0.9rem',
                    opacity: 0.7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid currentColor',
                    color: 'var(--text-secondary)'
                }}
            >
                i
            </span>

            {isVisible && (
                <div
                    className="tooltip-content glass-panel"
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '10px',
                        padding: '10px',
                        width: '200px',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                        color: 'var(--text-primary)',
                        zIndex: 1000,
                        textAlign: 'center',
                        pointerEvents: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                >
                    {content}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        marginLeft: '-5px',
                        borderWidth: '5px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(30, 30, 30, 0.7) transparent transparent transparent'
                    }} />
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
