import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  visual: React.ReactNode;
}

interface VisualTutorialProps {
  lessonId: string;
  onComplete: () => void;
}

function PizzaSliceDemo() {
  const [slices, setSlices] = useState(0);
  const totalSlices = 4;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: totalSlices }).map((_, i) => {
            const startAngle = (i * 360) / totalSlices - 90;
            const endAngle = ((i + 1) * 360) / totalSlices - 90;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 50 + 45 * Math.cos(startRad);
            const y1 = 50 + 45 * Math.sin(startRad);
            const x2 = 50 + 45 * Math.cos(endRad);
            const y2 = 50 + 45 * Math.sin(endRad);
            const filled = i < slices;
            
            return (
              <motion.path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                className={filled ? "fill-orange-400" : "fill-orange-100 dark:fill-orange-900/30"}
                stroke="#d97706"
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
          <circle cx="50" cy="50" r="8" className="fill-yellow-200" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-display font-bold text-foreground">
          {slices}/{totalSlices}
        </p>
        <p className="text-muted-foreground">
          {slices} out of {totalSlices} slices
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSlices(Math.max(0, slices - 1))}
          disabled={slices === 0}
          data-testid="button-remove-slice"
        >
          Remove Slice
        </Button>
        <Button
          size="sm"
          onClick={() => setSlices(Math.min(totalSlices, slices + 1))}
          disabled={slices === totalSlices}
          data-testid="button-add-slice"
        >
          Add Slice
        </Button>
      </div>
    </div>
  );
}

function DivisionDemo() {
  const [step, setStep] = useState(0);
  const totalItems = 12;
  const groups = 4;
  const perGroup = totalItems / groups;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center mb-2">
        <p className="text-lg font-semibold">{totalItems} cookies shared among {groups} friends</p>
      </div>
      
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="pile"
            className="flex flex-wrap justify-center gap-2 max-w-[200px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: totalItems }).map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-full bg-amber-600 border-2 border-amber-800 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-900" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="divided"
            className="grid grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: groups }).map((_, g) => (
              <div key={g} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold">
                  {g + 1}
                </div>
                <div className="flex flex-col gap-1">
                  {Array.from({ length: perGroup }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-6 rounded-full bg-amber-600 border border-amber-800"
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: g * 0.2 + i * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="text-center">
        <p className="text-xl font-display font-bold">
          {totalItems} ÷ {groups} = {perGroup}
        </p>
        <p className="text-muted-foreground text-sm">
          Each friend gets {perGroup} cookies!
        </p>
      </div>
      
      <Button
        size="sm"
        onClick={() => setStep(step === 0 ? 1 : 0)}
        data-testid="button-toggle-division"
      >
        <Play className="w-4 h-4 mr-1" />
        {step === 0 ? "Divide Them!" : "Start Over"}
      </Button>
    </div>
  );
}

function DecimalDemo() {
  const [amount, setAmount] = useState(10);
  const people = 4;
  const perPerson = (amount / people).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Splitting ${amount} among {people} friends</p>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.div
          className="w-24 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg"
          key={amount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          ${amount}
        </motion.div>
        <div className="text-3xl font-bold text-muted-foreground">÷</div>
        <div className="flex gap-1">
          {Array.from({ length: people }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      
      <motion.div
        className="text-center p-4 bg-muted rounded-xl"
        key={perPerson}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <p className="text-3xl font-display font-bold text-foreground">
          ${perPerson}
        </p>
        <p className="text-muted-foreground">
          Each person gets ${perPerson}
        </p>
      </motion.div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAmount(Math.max(4, amount - 2))}
          disabled={amount <= 4}
          data-testid="button-decrease-amount"
        >
          -$2
        </Button>
        <Button
          size="sm"
          onClick={() => setAmount(Math.min(20, amount + 2))}
          disabled={amount >= 20}
          data-testid="button-increase-amount"
        >
          +$2
        </Button>
      </div>
    </div>
  );
}

const lessonTutorials: Record<string, TutorialStep[]> = {
  "lesson-1": [
    {
      title: "What is a Fraction?",
      description: "A fraction shows parts of a whole. The top number (numerator) tells how many parts you have. The bottom number (denominator) tells how many equal parts in total.",
      visual: (
        <div className="text-center">
          <div className="text-6xl font-display font-bold mb-4">
            <span className="text-purple-500">3</span>
            <span className="text-foreground">/</span>
            <span className="text-pink-500">4</span>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div><span className="font-bold text-purple-500">3</span> = parts you have</div>
            <div><span className="font-bold text-pink-500">4</span> = total parts</div>
          </div>
        </div>
      ),
    },
    {
      title: "Try It: Pizza Fractions",
      description: "Click to add slices to the pizza. Watch how the fraction changes!",
      visual: <PizzaSliceDemo />,
    },
  ],
  "lesson-2": [
    {
      title: "What is Division?",
      description: "Division means sharing equally! When you divide, you split things into equal groups so everyone gets the same amount.",
      visual: (
        <div className="text-center">
          <div className="text-5xl font-display font-bold mb-4">
            12 ÷ 4 = 3
          </div>
          <p className="text-muted-foreground">
            12 things split into 4 groups = 3 in each group
          </p>
        </div>
      ),
    },
    {
      title: "Try It: Share the Cookies",
      description: "Watch how 12 cookies get divided equally among 4 friends!",
      visual: <DivisionDemo />,
    },
  ],
  "lesson-3": [
    {
      title: "Decimals from Division",
      description: "Sometimes when we divide, we don't get a whole number. That's when decimals help us! A decimal point shows parts smaller than 1.",
      visual: (
        <div className="text-center">
          <div className="text-5xl font-display font-bold mb-4">
            10 ÷ 4 = <span className="text-green-500">2.5</span>
          </div>
          <p className="text-muted-foreground">
            The .5 means "and a half" - each person gets 2 and a half!
          </p>
        </div>
      ),
    },
    {
      title: "Try It: Split the Money",
      description: "Change the amount and see how decimals help us divide money fairly!",
      visual: <DecimalDemo />,
    },
  ],
};

export function VisualTutorial({ lessonId, onComplete }: VisualTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = lessonTutorials[lessonId] || lessonTutorials["lesson-1"];
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-medium opacity-80">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentStep ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mt-2" data-testid="text-tutorial-title">
            {step.title}
          </h2>
        </div>

        <div className="p-6">
          <p className="text-lg text-muted-foreground mb-6 text-center" data-testid="text-tutorial-description">
            {step.description}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="min-h-[250px] flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {step.visual}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6 gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              data-testid="button-tutorial-prev"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button onClick={handleNext} data-testid="button-tutorial-next">
              {isLastStep ? "Start Quiz!" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
