import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// A small component for the charging sparkle effect
const Sparkle: React.FC<{delay: string}> = ({ delay }) => (
    <div 
        className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
        style={{ animationDelay: delay }}
    />
);

// --- Interactive Balloon Experiment Component ---
const BalloonExperiment: React.FC = () => {
    const [isCharged, setIsCharged] = useState(false);
    const [balloonPos, setBalloonPos] = useState({ x: 150, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    
    const balloonRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const initialPapersData = useMemo(() => Array.from({ length: 15 }, (_, i) => ({ 
        id: i, 
        x: Math.random() * 120, 
        y: Math.random() * 40,
        collected: false,
        stickPos: { x: 20 + Math.random() * 56, y: 20 + Math.random() * 92 }
    })), []);

    const [papers, setPapers] = useState(initialPapersData);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !balloonRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const balloonRect = balloonRef.current.getBoundingClientRect();

        let newX = e.clientX - containerRect.left - balloonRect.width / 2;
        let newY = e.clientY - containerRect.top - balloonRect.height / 2;

        newX = Math.max(0, Math.min(newX, containerRect.width - balloonRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - balloonRect.height));

        setBalloonPos({ x: newX, y: newY });

        const woolRect = { x: 0, y: containerRef.current.offsetHeight - 160, width: 128, height: 160 };
        const isOverWool = 
            (newX + balloonRect.width) > woolRect.x &&
            newX < (woolRect.x + woolRect.width) &&
            (newY + balloonRect.height) > woolRect.y &&
            newY < (woolRect.y + woolRect.height);

        if (isOverWool) {
            if (!isCharged) setIsCharged(true);
        }

        if (isCharged) {
            const balloonCenterX = newX + balloonRect.width / 2;
            const balloonCenterY = newY + balloonRect.height / 2;

            setPapers(currentPapers => currentPapers.map(paper => {
                if (!paper.collected) {
                    const paperX = 250 + paper.x;
                    const paperY = containerRect.height - 70 + paper.y;
                    const distance = Math.sqrt(Math.pow(balloonCenterX - paperX, 2) + Math.pow(balloonCenterY - paperY, 2));
                    
                    if (distance < 90) { // Attraction radius
                        return { ...paper, collected: true };
                    }
                }
                return paper;
            }));
        }
    }, [isDragging, isCharged]);
    
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMouseMove(e);
        const upHandler = () => handleMouseUp();

        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const resetExperiment = () => {
        setIsCharged(false);
        setPapers(initialPapersData);
        setBalloonPos({ x: 150, y: 50 });
    };
    
    const collectedCount = papers.filter(p => p.collected).length;

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">تجربة البالون وقصاصات الورق</h4>
            <p className="text-sm text-slate-400 mb-4">اسحب البالون وافركه فوق الصوف. ستلاحظ ظهور شحنات سالبة (-) عليه. ثم قربه من القصاصات وشاهدها تنجذب!</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-between items-end overflow-hidden select-none">
                <style>{`
                    @keyframes sparkle { 0% { transform: scale(1) rotate(0deg); opacity: 0.7; } 100% { transform: scale(2.5) rotate(90deg); opacity: 0; } }
                    .animate-sparkle { animation: sparkle 0.6s ease-out; }
                `}</style>
                <div className="w-32 h-40 bg-green-700 rounded-lg flex items-center justify-center text-center z-0">
                    <p className="font-bold text-lg">صوف</p>
                </div>
                
                {papers.map(paper => (
                    <div 
                        key={paper.id} 
                        className="absolute w-3 h-3 bg-white transform rotate-45 transition-all duration-300 ease-out z-20"
                        style={ paper.collected ? { left: balloonPos.x + paper.stickPos.x, top: balloonPos.y + paper.stickPos.y } : { left: 250 + paper.x, top: `calc(100% - 70px + ${paper.y}px)` } }
                    />
                ))}
                
                <div
                    ref={balloonRef}
                    className={`absolute w-24 h-32 rounded-full flex items-center justify-center text-black font-bold transition-all duration-300 z-10 ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'} ${isCharged ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]' : 'bg-red-500'}`}
                    style={{ left: balloonPos.x, top: balloonPos.y }}
                    onMouseDown={handleMouseDown}
                >
                    {isCharged && Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute text-white font-bold text-2xl select-none pointer-events-none" style={{ top: `${15 + Math.random() * 60}%`, left: `${15 + Math.random() * 60}%`}}>-</div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-slate-400">
                <div>
                    <p>حالة البالون: {isCharged ? <span className="text-yellow-400 font-bold">مشحون</span> : 'غير مشحون'}</p>
                    <p>القصاصات الملتصقة: {collectedCount} / {papers.length}</p>
                </div>
                <button onClick={resetExperiment} className="px-4 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">إعادة التجربة</button>
            </div>
        </div>
    );
};

// --- Charge Component for Electroscope ---
const Charge: React.FC<{ type: 'p' | 'n', x: number, y: number }> = ({ type, x, y }) => (
    <div
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all duration-500 ease-in-out`}
        style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)', // Center the charge on the coordinates
            backgroundColor: type === 'p' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)',
            color: 'white',
            border: `1px solid ${type === 'p' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.5)'}`
        }}
    >
        {type === 'p' ? '+' : '-'}
    </div>
);

// --- Interactive Electroscope Experiment ---
const ElectroscopeExperiment: React.FC = () => {
    const [rodPos, setRodPos] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const rodRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const initialCharges = useMemo(() => {
        const charges = [];
        // Generate 8 pairs of + and - charges
        for (let i = 0; i < 8; i++) {
            charges.push({ id: `p${i}`, type: 'p' as const, x: Math.random() * 30 + 175, y: Math.random() * 150 + 20 });
            charges.push({ id: `n${i}`, type: 'n' as const, x: Math.random() * 30 + 175, y: Math.random() * 150 + 20 });
        }
        return charges;
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !rodRef.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rodRect = rodRef.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - rodRect.width / 2;
        let newY = e.clientY - containerRect.top - rodRect.height / 2;
        newX = Math.max(0, Math.min(newX, containerRect.width - rodRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - rodRect.height));
        setRodPos({ x: newX, y: newY });
    }, [isDragging]);
    
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMouseMove(e);
        const upHandler = () => handleMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    
    const { leafAngle, isClose } = useMemo(() => {
        if (!containerRef.current || !rodRef.current) return { leafAngle: 2, isClose: false };
        const containerRect = containerRef.current.getBoundingClientRect();
        const electroscopeDiscX = containerRect.width / 2;
        const electroscopeDiscY = 50;
        const rodCenterX = rodPos.x + rodRef.current.offsetWidth / 2;
        const rodCenterY = rodPos.y + rodRef.current.offsetHeight / 2;
        const distance = Math.sqrt(Math.pow(rodCenterX - electroscopeDiscX, 2) + Math.pow(rodCenterY - electroscopeDiscY, 2));
        const maxAngle = 30;
        const maxDistance = 150;
        let angle = 2;
        if (distance < maxDistance) {
            angle = maxAngle * (1 - distance / maxDistance);
        }
        return { leafAngle: angle, isClose: angle > 5 };
    }, [rodPos]);

    const chargePositions = useMemo(() => {
        const discCenter = { x: 190, y: 30 };
        const leftLeafPos = { x: 180, y: 150 };
        const rightLeafPos = { x: 200, y: 150 };

        return initialCharges.map(charge => {
            if (isClose) {
                if (charge.type === 'n') { // Electrons are repelled
                    const isLeft = parseInt(charge.id.substring(1)) % 2 === 0;
                    return { ...charge, x: (isLeft ? leftLeafPos.x : rightLeafPos.x) + Math.random()*10 - 5, y: leftLeafPos.y + Math.random()*50 };
                } else { // Protons are attracted
                    return { ...charge, x: discCenter.x + Math.random()*40 - 20, y: discCenter.y + Math.random()*40 - 20 };
                }
            }
            // Neutral state: spread them out
            return { ...charge, x: discCenter.x + Math.random()*10 - 5, y: 80 + Math.random()*100 };
        });
    }, [isClose, initialCharges]);

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">محاكاة الكشاف الكهربائي</h4>
            <p className="text-sm text-slate-400 mb-4">اسحب الساق المشحونة وقربها من قرص الكشاف. لاحظ كيف تبتعد الشحنات السالبة (-) وتتجمع في الورقتين، مسببة تنافرهما.</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-center items-center select-none overflow-hidden">
                
                {chargePositions.map(c => <Charge key={c.id} type={c.type} x={c.x} y={c.y} />)}

                <div className="relative w-40 h-64 flex flex-col items-center z-10">
                    <div className="w-20 h-5 bg-yellow-300/80 rounded-t-md z-10" /> 
                    <div className="w-2 h-24 bg-yellow-300/80" />
                    <div className="absolute bottom-0 w-32 h-32 border-2 border-slate-500 rounded-b-full rounded-t-lg bg-slate-900/30 backdrop-blur-sm"></div>
                    <div className="absolute" style={{top: '115px'}}>
                        <div className="absolute left-1/2 -ml-1 w-2 h-16 bg-yellow-500/80 origin-top transition-transform duration-300" style={{ transform: `rotate(-${leafAngle}deg)` }} />
                        <div className="absolute left-1/2 -ml-1 w-2 h-16 bg-yellow-500/80 origin-top transition-transform duration-300" style={{ transform: `rotate(${leafAngle}deg)` }} />
                    </div>
                </div>

                <div 
                    ref={rodRef}
                    className={`absolute w-40 h-8 bg-blue-500 rounded-full flex items-center justify-evenly text-white font-bold text-2xl transition-all duration-200 z-20 ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'}`}
                    style={{ left: rodPos.x, top: rodPos.y }}
                    onMouseDown={handleMouseDown}
                >
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                </div>

            </div>
            <p className="mt-4 text-center text-slate-400 h-12 flex items-center justify-center transition-opacity">
                {isClose ? "تتنافر الإلكترونات (-) من الساق وتتجمع في الورقتين، فتكتسبان شحنة سالبة وتتنافران." : "الكشاف متعادل والورقتان منطبقتان."}
            </p>
        </div>
    );
};

// --- Interactive Induction Sphere Experiment ---
const InductionSphereExperiment: React.FC = () => {
    const [rodPos, setRodPos] = useState({ x: 20, y: 130 });
    const [isDragging, setIsDragging] = useState(false);
    const rodRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isGrounded, setIsGrounded] = useState(false);
    const [sphereIsCharged, setSphereIsCharged] = useState(false);
    const groundingTimer = useRef<number | null>(null);

    const initialCharges = useMemo(() => {
        const charges = [];
        for (let i = 0; i < 8; i++) {
            charges.push({ id: `p${i}`, type: 'p' as const });
            charges.push({ id: `n${i}`, type: 'n' as const });
        }
        return charges;
    }, []);

    const handleRodMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleRodMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !rodRef.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rodRect = rodRef.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - rodRect.width / 2;
        let newY = e.clientY - containerRect.top - rodRect.height / 2;
        newX = Math.max(0, Math.min(newX, containerRect.width - rodRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - rodRect.height));
        setRodPos({ x: newX, y: newY });
    }, [isDragging]);

    const handleRodMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleRodMouseMove(e);
        const upHandler = () => handleRodMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleRodMouseMove, handleRodMouseUp]);

    const rodIsClose = useMemo(() => {
        if (!containerRef.current || !rodRef.current) return false;
        const containerRect = containerRef.current.getBoundingClientRect();
        const sphereCenterX = containerRect.width / 2;
        const rodRightX = rodPos.x + rodRef.current.offsetWidth;
        const distance = sphereCenterX - rodRightX;
        return distance < 100;
    }, [rodPos]);

    const handleGroundMouseDown = () => {
        if (rodIsClose) {
            setIsGrounded(true);
            groundingTimer.current = window.setTimeout(() => {
                setSphereIsCharged(true);
            }, 400);
        }
    };
    const handleGroundMouseUp = () => {
        setIsGrounded(false);
        if (groundingTimer.current) {
            clearTimeout(groundingTimer.current);
        }
    };

    const resetExperiment = () => {
        setSphereIsCharged(false);
        setIsGrounded(false);
        setRodPos({ x: 20, y: 130 });
    };

    const chargePositions = useMemo(() => {
        const sphereCenter = { x: 88, y: 88 }; // Center of the 176x176 sphere div
        const sphereRadius = 75;

        let chargesToRender = initialCharges;
        if (sphereIsCharged) {
            chargesToRender = initialCharges.filter(c => c.type === 'p');
        }

        return chargesToRender.map(charge => {
            let angle, radius;
            const randomFactor = sphereRadius * (0.2 + Math.random() * 0.75);

            if (rodIsClose) {
                if (charge.type === 'p') {
                    // Attracted to the rod (left side)
                    angle = Math.PI + (Math.random() - 0.5) * (Math.PI / 1.5);
                    radius = randomFactor;
                } else { // 'n' charges are repelled (right side)
                    angle = (Math.random() - 0.5) * (Math.PI / 1.5);
                    radius = randomFactor;
                }
            } else { // Rod is far away, distribute evenly
                angle = Math.random() * 2 * Math.PI;
                radius = randomFactor;
            }
            
            // For grounded electrons, move them out of sight
            if (isGrounded && rodIsClose && charge.type === 'n') {
                return { ...charge, x: sphereCenter.x + sphereRadius + 50, y: sphereCenter.y, grounded: true };
            }

            return { ...charge, x: sphereCenter.x + Math.cos(angle) * radius, y: sphereCenter.y + Math.sin(angle) * radius, grounded: false };
        });
    }, [rodIsClose, isGrounded, sphereIsCharged, initialCharges]);
    
    let instruction = "قرّب الساق السالبة من الكرة المعدنية.";
    if (rodIsClose && !sphereIsCharged && !isGrounded) {
        instruction = "ممتاز! الآن المس الكرة لتفريغ الشحنات السالبة (اضغط باستمرار على زر 'تأريض الكرة').";
    } else if (isGrounded) {
        instruction = "يتم الآن تفريغ الشحنات السالبة... ارفع إصبعك (أوقف التأريض) قبل إبعاد الساق.";
    } else if (rodIsClose && sphereIsCharged && !isGrounded) {
        instruction = "أحسنت! الآن أبعد الساق لترى توزع الشحنة الموجبة الصافية على الكرة.";
    } else if (!rodIsClose && sphereIsCharged) {
        instruction = "نجحت! لقد تم شحن الكرة بشحنة موجبة عن طريق الحث.";
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">تجربة الشحن بالحث</h4>
            <p className="text-sm text-slate-400 mb-4">استخدم الساق المشحونة لشحن الكرة المعدنية بالحث. اتبع الخطوات لفصل الشحنات وترك الكرة بشحنة صافية.</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-center items-center select-none overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-44 h-44 bg-gray-400 rounded-full shadow-inner border-2 border-gray-300 relative overflow-hidden">
                    {chargePositions.map(c => (
                        <Charge key={c.id} type={c.type} x={c.x} y={c.y} />
                    ))}
                </div>
                
                {isGrounded && rodIsClose && (
                    <div className="absolute w-1 h-28 bg-cyan-400/70" style={{ left: 'calc(50% + 88px)', top: '170px' }} />
                )}

                <div 
                    ref={rodRef}
                    className={`absolute w-40 h-8 bg-blue-500 rounded-full flex items-center justify-evenly text-white font-bold text-2xl transition-all duration-200 z-20 ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'}`}
                    style={{ left: rodPos.x, top: rodPos.y }}
                    onMouseDown={handleRodMouseDown}
                >
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                </div>
            </div>
             <div className="mt-4 flex justify-between items-center">
                 <p className="text-center text-amber-300 h-12 flex items-center justify-center transition-opacity text-sm sm:text-base w-2/3">
                    {instruction}
                </p>
                <div className="flex gap-2">
                    <button 
                        onMouseDown={handleGroundMouseDown} 
                        onMouseUp={handleGroundMouseUp}
                        onTouchStart={handleGroundMouseDown}
                        onTouchEnd={handleGroundMouseUp}
                        disabled={!rodIsClose || sphereIsCharged}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        تأريض الكرة
                    </button>
                    <button onClick={resetExperiment} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">إعادة</button>
                </div>
            </div>
        </div>
    );
};


interface ExperimentsSectionProps {
  experiments: { id: number; title: string; description: string }[];
}

const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({ experiments }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {experiments.map((exp) => (
        <div key={exp.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-2xl font-bold text-indigo-400">{exp.title}</h3>
          <p className="text-slate-300 mt-2">{exp.description}</p>
          
          {exp.id === 1 && <BalloonExperiment />}
          {exp.id === 2 && <ElectroscopeExperiment />}
          {exp.id === 3 && <InductionSphereExperiment />}

        </div>
      ))}
    </div>
  );
};

export default ExperimentsSection;
