import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenLine, Eraser, RotateCcw, ChevronRight, X, Lightbulb } from "lucide-react";

interface EquationStep {
  content: string;
  explanation: string;
}

interface SketchPadProps {
  equation: string;
  steps: EquationStep[];
  onClose: () => void;
}

export function SketchPad({ equation, steps, onClose }: SketchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGridLines(ctx, rect.width, rect.height);
  }, []);

  const drawGridLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#fcd34d";
    ctx.lineWidth = 1;
    const lineSpacing = 24;
    for (let y = lineSpacing; y < height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    if (tool === "eraser") {
      ctx.strokeStyle = "#fef3c7";
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 3;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, rect.width, rect.height);
    drawGridLines(ctx, rect.width, rect.height);
  };

  const showNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setRevealedSteps([...revealedSteps, nextStep]);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <PenLine className="w-5 h-5" />
              <h3 className="font-display font-bold text-lg">Math Scratch Pad</h3>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose} className="text-white" data-testid="button-close-sketchpad">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            <div className="text-center bg-muted p-3 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Solve this problem:</p>
              <p className="text-2xl font-display font-bold" data-testid="text-equation">{equation}</p>
            </div>

            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-48 rounded-xl border-2 border-amber-300 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                data-testid="canvas-sketchpad"
              />

              <AnimatePresence>
                {revealedSteps.map((stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    className="absolute left-4 pointer-events-none font-mono text-lg"
                    style={{ top: 20 + stepIndex * 28 }}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ delay: 2, duration: 1 }}
                  >
                    <span className="text-blue-800 dark:text-blue-300">{steps[stepIndex].content}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={tool === "pen" ? "default" : "outline"}
                  onClick={() => setTool("pen")}
                  data-testid="button-pen"
                >
                  <PenLine className="w-4 h-4 mr-1" />
                  Pen
                </Button>
                <Button
                  size="sm"
                  variant={tool === "eraser" ? "default" : "outline"}
                  onClick={() => setTool("eraser")}
                  data-testid="button-eraser"
                >
                  <Eraser className="w-4 h-4 mr-1" />
                  Eraser
                </Button>
                <Button size="sm" variant="outline" onClick={clearCanvas} data-testid="button-clear">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>

              <Button
                size="sm"
                onClick={showNextStep}
                disabled={currentStep >= steps.length - 1}
                className="bg-amber-500 hover:bg-amber-600"
                data-testid="button-show-step"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                {currentStep === -1 ? "Show First Step" : currentStep >= steps.length - 1 ? "All Steps Shown" : "Show Next Step"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>

            {currentStep >= 0 && (
              <motion.div
                className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentStep}
              >
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Step {currentStep + 1}: {steps[currentStep].explanation}
                </p>
                <p className="font-mono text-lg mt-1">{steps[currentStep].content}</p>
              </motion.div>
            )}

            <div className="flex justify-center gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= currentStep ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function getEquationSteps(question: string): { equation: string; steps: EquationStep[] } {
  if (question.includes("$1.00") && question.includes("4")) {
    return {
      equation: "$1.00 ÷ 4 = ?",
      steps: [
        { content: "1.00 ÷ 4", explanation: "Set up the division" },
        { content: "4 goes into 10 → 2 times", explanation: "4 × 2 = 8, which is close to 10" },
        { content: "10 - 8 = 2", explanation: "Subtract to find remainder" },
        { content: "Bring down 0 → 20", explanation: "20 left to divide" },
        { content: "4 goes into 20 → 5 times", explanation: "4 × 5 = 20, perfect!" },
        { content: "Answer: $0.25", explanation: "Each person gets 25 cents (1 quarter)" },
      ],
    };
  }
  
  if (question.includes("$2.00") && question.includes("4")) {
    return {
      equation: "$2.00 ÷ 4 = ?",
      steps: [
        { content: "2.00 ÷ 4", explanation: "Set up the division" },
        { content: "4 goes into 20 → 5 times", explanation: "4 × 5 = 20" },
        { content: "20 - 20 = 0", explanation: "No remainder for the dollars" },
        { content: "Bring down 0 → 0", explanation: "Nothing left to divide" },
        { content: "Answer: $0.50", explanation: "Each person gets 50 cents (2 quarters)" },
      ],
    };
  }

  if (question.includes("quarters") && question.includes("$1.00")) {
    return {
      equation: "? × 25¢ = $1.00",
      steps: [
        { content: "25 + 25 = 50", explanation: "2 quarters = 50 cents" },
        { content: "50 + 25 = 75", explanation: "3 quarters = 75 cents" },
        { content: "75 + 25 = 100", explanation: "4 quarters = 100 cents" },
        { content: "Answer: 4 quarters", explanation: "4 × 25¢ = $1.00" },
      ],
    };
  }

  if (question.includes("fraction") || question.includes("colored")) {
    return {
      equation: "Count the parts!",
      steps: [
        { content: "Count colored parts", explanation: "How many parts are filled in?" },
        { content: "Count total parts", explanation: "How many parts are there in total?" },
        { content: "Write: colored/total", explanation: "Put colored on top, total on bottom" },
      ],
    };
  }

  return {
    equation: question.slice(0, 30) + "...",
    steps: [
      { content: "Read the problem carefully", explanation: "Understand what's being asked" },
      { content: "Identify the numbers", explanation: "Find the important values" },
      { content: "Choose the operation", explanation: "Add, subtract, multiply, or divide?" },
      { content: "Solve step by step", explanation: "Work through it carefully" },
    ],
  };
}
