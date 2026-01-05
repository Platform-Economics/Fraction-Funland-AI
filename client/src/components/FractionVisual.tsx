import { motion } from "framer-motion";

interface FractionVisualProps {
  numerator: number;
  denominator: number;
  type: "pizza" | "bar" | "circles" | "objects";
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export function FractionVisual({
  numerator,
  denominator,
  type,
  size = "medium",
  showLabel = true,
  className = "",
  animated = true,
}: FractionVisualProps) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-40 h-40",
    large: "w-56 h-56",
  };

  const colors = [
    "bg-purple-400 dark:bg-purple-500",
    "bg-pink-400 dark:bg-pink-500",
    "bg-orange-400 dark:bg-orange-500",
    "bg-cyan-400 dark:bg-cyan-500",
    "bg-green-400 dark:bg-green-500",
    "bg-yellow-400 dark:bg-yellow-500",
    "bg-red-400 dark:bg-red-500",
    "bg-indigo-400 dark:bg-indigo-500",
  ];

  const renderPizza = () => {
    const slices = [];
    const anglePerSlice = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const isFilled = i < numerator;
      const startAngle = i * anglePerSlice - 90;
      const endAngle = startAngle + anglePerSlice;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = 50 + 48 * Math.cos(startRad);
      const y1 = 50 + 48 * Math.sin(startRad);
      const x2 = 50 + 48 * Math.cos(endRad);
      const y2 = 50 + 48 * Math.sin(endRad);
      
      const largeArc = anglePerSlice > 180 ? 1 : 0;
      
      slices.push(
        <motion.path
          key={i}
          d={`M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={isFilled ? "currentColor" : "transparent"}
          stroke="currentColor"
          strokeWidth="2"
          className={isFilled ? "text-orange-400 dark:text-orange-500" : "text-muted-foreground/30"}
          initial={animated ? { opacity: 0, scale: 0.8 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      );
    }
    
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="hsl(45, 90%, 85%)" className="dark:fill-yellow-200" />
          {slices}
          <circle cx="50" cy="50" r="48" fill="none" stroke="hsl(30, 70%, 50%)" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  const renderBar = () => {
    return (
      <div className={`${className} flex flex-col items-center gap-2`}>
        <div className="flex gap-1 p-2 bg-muted rounded-lg">
          {Array.from({ length: denominator }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-12 h-16 rounded-md border-2 border-border ${
                i < numerator 
                  ? "bg-gradient-to-b from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700" 
                  : "bg-muted-foreground/20"
              }`}
              initial={animated ? { scaleY: 0 } : {}}
              animate={animated ? { scaleY: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              style={{ transformOrigin: "bottom" }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderCircles = () => {
    return (
      <div className={`${className} flex flex-wrap gap-3 justify-center items-center max-w-xs`}>
        {Array.from({ length: denominator }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 rounded-full border-3 ${
              i < numerator
                ? `${colors[i % colors.length]} border-white/50`
                : "bg-muted-foreground/20 border-muted-foreground/30"
            }`}
            initial={animated ? { scale: 0 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
          />
        ))}
      </div>
    );
  };

  const renderObjects = () => {
    return (
      <div className={`${className} flex flex-wrap gap-3 justify-center items-center max-w-xs`}>
        {Array.from({ length: denominator }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              i < numerator
                ? "bg-gradient-to-br from-pink-200 to-orange-200 dark:from-pink-300 dark:to-orange-300 shadow-md"
                : "bg-muted-foreground/10 opacity-40"
            }`}
            initial={animated ? { y: 20, opacity: 0 } : {}}
            animate={animated ? { y: 0, opacity: i < numerator ? 1 : 0.4 } : {}}
            transition={{ delay: i * 0.08, type: "spring" }}
          >
            <div className={`w-8 h-8 rounded-full ${i < numerator ? "bg-gradient-to-br from-orange-400 to-red-500" : "bg-muted-foreground/30"}`} />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderVisual = () => {
    switch (type) {
      case "pizza":
        return renderPizza();
      case "bar":
        return renderBar();
      case "circles":
        return renderCircles();
      case "objects":
        return renderObjects();
      default:
        return renderPizza();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {renderVisual()}
      {showLabel && (
        <motion.div
          className="text-4xl font-display font-bold text-foreground"
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <span className="text-primary">{numerator}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-secondary">{denominator}</span>
        </motion.div>
      )}
    </div>
  );
}
