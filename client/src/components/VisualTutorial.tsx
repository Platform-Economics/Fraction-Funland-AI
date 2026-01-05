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

function Coin({ type, size = "md" }: { type: "quarter" | "half" | "dollar"; size?: "sm" | "md" }) {
  const sizes = size === "sm" ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
  const colors = {
    quarter: "bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500",
    half: "bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400",
    dollar: "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600",
  };
  const labels = { quarter: "25¢", half: "50¢", dollar: "$1" };

  return (
    <motion.div
      className={`${sizes} ${colors[type]} rounded-full border-2 flex items-center justify-center font-bold shadow-md`}
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      {labels[type]}
    </motion.div>
  );
}

function MeetTheMoneyDemo() {
  const [selectedCombo, setSelectedCombo] = useState(0);
  const combos = [
    { coins: ["quarter", "quarter", "quarter", "quarter"], label: "4 quarters", value: "1.00" },
    { coins: ["half", "half"], label: "2 half-dollars", value: "1.00" },
    { coins: ["dollar"], label: "1 dollar", value: "1.00" },
    { coins: ["half", "quarter", "quarter"], label: "1 half + 2 quarters", value: "1.00" },
  ];
  const combo = combos[selectedCombo];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {combo.coins.map((type, i) => (
          <motion.div key={`${selectedCombo}-${i}`} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}>
            <Coin type={type as "quarter" | "half" | "dollar"} />
          </motion.div>
        ))}
      </div>
      <motion.div key={selectedCombo} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-xl">
        <p className="font-bold text-lg">{combo.label}</p>
        <p className="text-2xl font-display font-bold text-green-600 dark:text-green-400">= ${combo.value}</p>
      </motion.div>
      <div className="flex gap-2 flex-wrap justify-center">
        {combos.map((c, i) => (
          <Button key={i} size="sm" variant={i === selectedCombo ? "default" : "outline"} onClick={() => setSelectedCombo(i)} data-testid={`button-combo-${i}`}>
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ShareTheDollarDemo() {
  const [distributed, setDistributed] = useState(false);
  const friends = 4;
  const quartersEach = 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {!distributed ? (
          <motion.div key="pile" className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <Coin type="quarter" />
                </motion.div>
              ))}
            </div>
            <p className="text-center font-semibold">$1.00 in quarters</p>
          </motion.div>
        ) : (
          <motion.div key="split" className="grid grid-cols-4 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: friends }).map((_, f) => (
              <div key={f} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-sm">
                  {f + 1}
                </div>
                {Array.from({ length: quartersEach }).map((_, q) => (
                  <motion.div key={q} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: f * 0.2 }}>
                    <Coin type="quarter" size="sm" />
                  </motion.div>
                ))}
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">$0.25</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-center bg-muted p-3 rounded-xl">
        <p className="text-xl font-display font-bold">$1.00 ÷ 4 = $0.25</p>
        <p className="text-sm text-muted-foreground">Each friend gets 1 quarter!</p>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">1/4 of a dollar = 25 cents</p>
      </div>
      <Button size="sm" onClick={() => setDistributed(!distributed)} data-testid="button-share-dollar">
        <Play className="w-4 h-4 mr-1" />
        {distributed ? "Start Over" : "Share It!"}
      </Button>
    </div>
  );
}

function TraditionalDivisionDemo() {
  const [step, setStep] = useState(0);
  const maxSteps = 7;
  const steps = [
    { text: "Let's divide 100 ÷ 4 the old-fashioned way!" },
    { text: "Write it in the 'division house' - divisor outside, dividend inside" },
    { text: "4 goes into 10 how many times? 2 times! Write 2 above." },
    { text: "2 × 4 = 8. Write 8 below and subtract: 10 - 8 = 2" },
    { text: "Bring down the 0. Now we have 20. 4 goes into 20... 5 times!" },
    { text: "5 × 4 = 20. Subtract: 20 - 20 = 0. We're done! Answer: 25" },
    { text: "CHECK with multiplication: 4 × 25 = 100. It works!" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border-2 border-amber-200 dark:border-amber-800 min-w-[280px]">
        <div className="font-mono text-xl md:text-2xl relative">
          <div className="flex items-start">
            <div className="flex flex-col items-end mr-1">
              <motion.span 
                className="text-blue-600 dark:text-blue-400 font-bold text-lg"
                animate={{ opacity: step >= 1 ? 1 : 0 }}
              >
                4
              </motion.span>
            </div>
            <div className="relative">
              <motion.div 
                className="absolute -left-1 top-0 bottom-0 w-1 bg-foreground"
                animate={{ opacity: step >= 1 ? 1 : 0 }}
              />
              <motion.div 
                className="absolute -left-1 -top-1 right-0 h-1 bg-foreground rounded-tr-lg"
                style={{ width: "calc(100% + 4px)" }}
                animate={{ opacity: step >= 1 ? 1 : 0 }}
              />
              <div className="pl-3 pt-2">
                <div className="flex items-center h-8">
                  <motion.span 
                    className="text-green-600 dark:text-green-400 font-bold"
                    animate={{ opacity: step >= 2 ? 1 : 0 }}
                  >
                    2
                  </motion.span>
                  <motion.span 
                    className="text-green-600 dark:text-green-400 font-bold"
                    animate={{ opacity: step >= 4 ? 1 : 0 }}
                  >
                    5
                  </motion.span>
                </div>
                <div className="border-b-2 border-dashed border-gray-300 dark:border-gray-600 mb-1" />
                <motion.div animate={{ opacity: step >= 1 ? 1 : 0 }}>
                  <span className={step >= 2 ? "text-muted-foreground" : ""}>1</span>
                  <span className={step >= 2 ? "text-purple-600 dark:text-purple-400 font-bold" : ""}>0</span>
                  <span className={step >= 4 ? "text-muted-foreground" : ""}>0</span>
                </motion.div>
                {step >= 3 && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 dark:text-red-400 text-base">
                    <div className="flex items-center">
                      <span className="mr-1">-</span>
                      <span className="w-4">8</span>
                      <span className="text-xs text-muted-foreground ml-2">(4×2)</span>
                    </div>
                    <div className="border-t border-foreground w-8 my-0.5" />
                    <span className="pl-1">2</span>
                    {step >= 4 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-600 dark:text-purple-400">0</motion.span>}
                  </motion.div>
                )}
                {step >= 5 && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 dark:text-red-400 text-base">
                    <div className="flex items-center">
                      <span className="mr-1">-</span>
                      <span>20</span>
                      <span className="text-xs text-muted-foreground ml-2">(4×5)</span>
                    </div>
                    <div className="border-t border-foreground w-8 my-0.5" />
                    <span className="pl-2 text-green-600 dark:text-green-400 font-bold">0</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {step >= 6 && (
        <motion.div 
          className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border-2 border-green-300 dark:border-green-700"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2 text-center">Check with Multiplication!</p>
          <div className="font-mono text-xl text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">4</span>
              <span>×</span>
              <span className="text-green-600 dark:text-green-400">25</span>
              <span>=</span>
              <span className="font-bold">100</span>
            </div>
            <motion.p 
              className="text-sm text-green-600 dark:text-green-400 font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              It matches! Our answer is correct!
            </motion.p>
          </div>
        </motion.div>
      )}

      <motion.p key={step} className="text-center font-semibold text-base px-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {steps[step].text}
      </motion.p>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} data-testid="button-trad-div-prev">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button size="sm" onClick={() => setStep(Math.min(maxSteps - 1, step + 1))} disabled={step === maxSteps - 1} data-testid="button-trad-div-next">
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function LongDivisionDemo() {
  const [step, setStep] = useState(0);
  const maxSteps = 5;
  const steps = [
    { highlight: "setup", text: "Set up: 1.00 ÷ 4" },
    { highlight: "decimal", text: "Place decimal point above" },
    { highlight: "step1", text: "4 goes into 10 → 2 times (8)" },
    { highlight: "step2", text: "10 - 8 = 2, bring down 0" },
    { highlight: "step3", text: "4 goes into 20 → 5 times. Answer: 0.25!" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800">
        <div className="font-mono text-xl md:text-2xl space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">4</span>
            <span className="border-l-2 border-t-2 border-foreground pl-2 pt-1">
              <motion.span className={step >= 1 ? "text-green-600 dark:text-green-400 font-bold" : ""} animate={{ opacity: step >= 1 ? 1 : 0.3 }}>0.</motion.span>
              <motion.span className={step >= 2 ? "text-green-600 dark:text-green-400 font-bold" : ""} animate={{ opacity: step >= 2 ? 1 : 0.3 }}>2</motion.span>
              <motion.span className={step >= 4 ? "text-green-600 dark:text-green-400 font-bold" : ""} animate={{ opacity: step >= 4 ? 1 : 0.3 }}>5</motion.span>
            </span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <span className="border-l-2 border-foreground pl-2">1.00</span>
          </div>
          {step >= 2 && (
            <motion.div className="pl-6 text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div>- 8 (4×2)</div>
              <div className="border-t border-foreground">20</div>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div className="pl-6 text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div>-20 (4×5)</div>
              <div className="border-t border-foreground">0</div>
            </motion.div>
          )}
        </div>
      </div>
      <motion.p key={step} className="text-center font-semibold text-lg" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {steps[step].text}
      </motion.p>
      <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
        <Coin type="quarter" size="sm" />
        <span className="font-bold">= $0.25 = 25¢</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} data-testid="button-division-prev">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button size="sm" onClick={() => setStep(Math.min(maxSteps - 1, step + 1))} disabled={step === maxSteps - 1} data-testid="button-division-next">
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CurrencySplitDemo() {
  const [dollars, setDollars] = useState(2);
  const [people, setPeople] = useState(4);
  const perPerson = dollars / people;
  const cents = Math.round(perPerson * 100);
  const quartersCount = Math.floor(cents / 25);
  const remainingAfterQuarters = cents % 25;
  const dimesCount = Math.floor(remainingAfterQuarters / 10);
  const nickelsCount = Math.floor((remainingAfterQuarters % 10) / 5);
  const penniesCount = remainingAfterQuarters % 5;

  const getCoinBreakdown = () => {
    const parts = [];
    if (quartersCount > 0) parts.push(`${quartersCount} quarter${quartersCount > 1 ? "s" : ""}`);
    if (dimesCount > 0) parts.push(`${dimesCount} dime${dimesCount > 1 ? "s" : ""}`);
    if (nickelsCount > 0) parts.push(`${nickelsCount} nickel${nickelsCount > 1 ? "s" : ""}`);
    if (penniesCount > 0) parts.push(`${penniesCount} penn${penniesCount > 1 ? "ies" : "y"}`);
    return parts.length > 0 ? parts.join(" + ") : "0 cents";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Amount</p>
          <div className="flex gap-1">
            {Array.from({ length: dollars }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Coin type="dollar" size="sm" />
              </motion.div>
            ))}
          </div>
        </div>
        <span className="text-3xl font-bold text-muted-foreground">÷</span>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Friends</p>
          <div className="flex gap-1">
            {Array.from({ length: people }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <motion.div key={`${dollars}-${people}`} className="text-center bg-muted p-4 rounded-xl" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <p className="text-2xl font-display font-bold">${dollars}.00 ÷ {people} = ${perPerson.toFixed(2)}</p>
        <p className="text-muted-foreground text-sm">Each person gets {getCoinBreakdown()}</p>
        <p className="text-xs text-muted-foreground mt-1">({cents} cents each)</p>
      </motion.div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setDollars(Math.max(1, dollars - 1))} disabled={dollars <= 1} data-testid="button-less-dollars">-</Button>
          <span className="font-bold">${dollars}</span>
          <Button size="sm" variant="outline" onClick={() => setDollars(Math.min(4, dollars + 1))} disabled={dollars >= 4} data-testid="button-more-dollars">+</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPeople(Math.max(2, people - 1))} disabled={people <= 2} data-testid="button-less-people">-</Button>
          <span className="font-bold">{people} ppl</span>
          <Button size="sm" variant="outline" onClick={() => setPeople(Math.min(5, people + 1))} disabled={people >= 5} data-testid="button-more-people">+</Button>
        </div>
      </div>
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
      title: "Meet the Money!",
      description: "Before we divide, let's learn about coins! Different coins can add up to the same amount. Tap each option to see!",
      visual: <MeetTheMoneyDemo />,
    },
    {
      title: "Share the Dollar",
      description: "Division means sharing equally! Watch how $1.00 (4 quarters) gets divided among 4 friends.",
      visual: <ShareTheDollarDemo />,
    },
    {
      title: "Traditional Long Division",
      description: "Here's the classic way to divide - with the 'division house'! We'll also check our answer using multiplication.",
      visual: <TraditionalDivisionDemo />,
    },
    {
      title: "Division with Decimals",
      description: "Now let's try with dollars and cents. The same method works with decimals too!",
      visual: <LongDivisionDemo />,
    },
    {
      title: "Try Different Amounts",
      description: "Now you try! Change the dollars and number of friends to see how division works with different amounts.",
      visual: <CurrencySplitDemo />,
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
