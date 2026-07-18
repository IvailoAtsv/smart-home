"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BUDGET_LEVEL_TITLES,
  MAX_ROOMS,
  RECOMMENDED_BUDGET,
  RECOMMENDED_VOICE,
  budgetAmountFor,
  budgetAmountsForRooms,
  budgetLevelDescription,
  formatBudgetLabel,
  suggestVoiceStrategy,
  TEST_OS_LABELS,
  VOICE_STRATEGY_LABELS,
  type BudgetLevel,
  type TestOs,
  type UserPrefs,
  type VoiceStrategy,
} from "@/data/prefs/types";
import { Button } from "@/components/ui/Button";

type Draft = Omit<UserPrefs, "onboardingDone">;

type OnboardingWizardProps = {
  initial: Draft;
  onComplete: (prefs: Draft) => void;
};

const STEPS = ["welcome", "voice", "test", "scale", "summary"] as const;
const BUDGET_LEVELS: BudgetLevel[] = ["lean", "comfort", "full"];

export function OnboardingWizard({ initial, onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => ({
    ...initial,
    rooms: Math.min(Math.max(initial.rooms, 1), MAX_ROOMS),
    budgetEur: budgetAmountFor(
      Math.min(Math.max(initial.rooms, 1), MAX_ROOMS),
      initial.budgetLevel ?? RECOMMENDED_BUDGET,
    ),
    budgetLevel: initial.budgetLevel ?? RECOMMENDED_BUDGET,
  }));
  const step = STEPS[index];

  const suggestion = useMemo(
    () => suggestVoiceStrategy(draft.budgetLevel, draft.rooms),
    [draft.budgetLevel, draft.rooms],
  );

  const patch = (p: Partial<Draft>) =>
    setDraft((d) => {
      const next = { ...d, ...p };
      if (p.rooms !== undefined || p.budgetLevel !== undefined) {
        next.budgetEur = budgetAmountFor(next.rooms, next.budgetLevel);
      }
      return next;
    });

  const next = () => setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setIndex((i) => Math.max(i - 1, 0));

  const finish = (goTest: boolean) => {
    onComplete({
      ...draft,
      budgetEur: budgetAmountFor(draft.rooms, draft.budgetLevel),
    });
    if (goTest) router.push("/test");
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] md:max-w-xl">
      <div className="mb-6">
        <p className="text-[12px] font-bold tracking-wide text-muted-foreground">
          Настройка · {index + 1}/{STEPS.length}
        </p>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={STEPS[i]}
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                i <= index ? "bg-secondary" : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {step === "welcome" ? <WelcomeStep /> : null}
        {step === "voice" ? (
          <VoiceStep
            value={draft.voiceStrategy}
            onChange={(voiceStrategy) => patch({ voiceStrategy })}
          />
        ) : null}
        {step === "test" ? (
          <TestStep
            value={draft.testOs}
            onChange={(testOs) => patch({ testOs })}
          />
        ) : null}
        {step === "scale" ? (
          <ScaleStep
            rooms={draft.rooms}
            budgetLevel={draft.budgetLevel}
            onRooms={(rooms) => patch({ rooms })}
            onBudgetLevel={(budgetLevel) => patch({ budgetLevel })}
          />
        ) : null}
        {step === "summary" ? (
          <SummaryStep draft={draft} suggestion={suggestion} />
        ) : null}
      </div>

      <div className="mt-8 space-y-3">
        {step === "summary" ? (
          <>
            <Button fullWidth size="lg" onClick={() => finish(false)}>
              {draft.testOs === "skip"
                ? "Към пълния план"
                : "Запази и отвори пълния план"}
            </Button>
            {draft.testOs !== "skip" ? (
              <Button
                fullWidth
                variant="outline"
                size="md"
                onClick={() => finish(true)}
              >
                Започни с минималния тест
              </Button>
            ) : null}
          </>
        ) : (
          <div className={index > 0 ? "grid grid-cols-2 gap-2" : ""}>
            {index > 0 ? (
              <Button variant="outline" fullWidth onClick={back}>
                Назад
              </Button>
            ) : null}
            <Button fullWidth onClick={next}>
              Напред
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div>
      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-primary">
        Глас на български вкъщи — без Alexa и Google
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-foreground/90">
        Готовите гласови асистенти почти не разбират български. Това wiki ти
        помага да си направиш локален умен дом: казваш „Тъмно е в хола“ — и
        лампата светва, без да пращаш всяка дума в чужд облак (освен ако сам не
        избереш).
      </p>
      <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">
        Стъпките са за Home Assistant OS, Shelly релета и микрофон в стаята
        (ATOM Echo и/или Voice PE). Няколко въпроса — после планът се наглася
        към хардуера, бюджета и броя стаи.
      </p>
      <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        <li>
          <span className="font-semibold text-primary">Проблемът:</span> искаш
          гласови команди на език, който Alexa/Google не поддържат добре.
        </li>
        <li>
          <span className="font-semibold text-primary">Решението:</span> свой
          сървър вкъщи + локални (или cloud) STT и Assist pipeline.
        </li>
        <li>
          <span className="font-semibold text-primary">Сървър:</span> винаги
          Home Assistant OS на mini PC.
        </li>
        <li>
          <span className="font-semibold text-primary">По избор:</span> кратък
          тест във VM преди да купиш хардуер.
        </li>
        <li>
          <span className="font-semibold text-primary">Безопасност:</span> 220 V
          монтаж — само с електротехник.
        </li>
      </ul>
    </div>
  );
}

function ChoiceCard({
  selected,
  title,
  description,
  onClick,
  recommended,
  priceLabel,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
  recommended?: boolean;
  priceLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "w-full cursor-pointer rounded-[16px] border-2 px-4 py-4 text-left transition-colors active:scale-[0.99]",
        selected
          ? "border-secondary bg-secondary/10"
          : "border-border hover:border-primary/40",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[16px] font-bold text-primary">{title}</p>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {recommended ? (
            <span className="rounded-md bg-secondary/25 px-2 py-0.5 text-[11px] font-bold tracking-wide text-secondary-foreground">
              Препоръчано
            </span>
          ) : null}
          {priceLabel ? (
            <span className="text-[14px] font-bold tabular-nums text-primary">
              {priceLabel}
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  );
}

function VoiceStep({
  value,
  onChange,
}: {
  value: VoiceStrategy;
  onChange: (v: VoiceStrategy) => void;
}) {
  return (
    <div>
      <h2 className="text-[24px] font-extrabold text-primary">
        Гласово устройство
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Как ще слушаш команди вкъщи? Можеш да смениш по-късно от настройките.
      </p>
      <div className="mt-6 space-y-3">
        <ChoiceCard
          selected={value === "atom"}
          title={VOICE_STRATEGY_LABELS.atom}
          description="Евтин M5Stack куб (~13 €). Добър за много стаи и тесен бюджет. Микрофонът е по-слаб на разстояние."
          onClick={() => onChange("atom")}
        />
        <ChoiceCard
          selected={value === "voice-pe"}
          title={VOICE_STRATEGY_LABELS["voice-pe"]}
          description="Официалният Home Assistant микрофон (~59 €). По-добър звук за хол и натоварени стаи."
          onClick={() => onChange("voice-pe")}
        />
        <ChoiceCard
          selected={value === "hybrid"}
          recommended={RECOMMENDED_VOICE === "hybrid"}
          title={VOICE_STRATEGY_LABELS.hybrid}
          description="Voice PE в хола / натоварените стаи, ATOM Echo в останалите. Най-често най-разумният баланс."
          onClick={() => onChange("hybrid")}
        />
      </div>
    </div>
  );
}

function TestStep({
  value,
  onChange,
}: {
  value: TestOs;
  onChange: (v: TestOs) => void;
}) {
  return (
    <div>
      <h2 className="text-[24px] font-extrabold text-primary">
        Ще тестваш ли първо?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Минималният тест пуска временна Home Assistant OS във VM на компютъра
        ти — преди да купиш постоянен mini PC. Постоянният сървър винаги е HAOS.
      </p>
      <div className="mt-6 space-y-3">
        <ChoiceCard
          selected={value === "skip"}
          title={TEST_OS_LABELS.skip}
          description="Отиваш директно към пълния план с mini PC."
          onClick={() => onChange("skip")}
        />
        <ChoiceCard
          selected={value === "macos"}
          title={TEST_OS_LABELS.macos}
          description="UTM + ARM64 HAOS image. Подходящо за MacBook с Apple Silicon."
          onClick={() => onChange("macos")}
        />
        <ChoiceCard
          selected={value === "windows"}
          title={TEST_OS_LABELS.windows}
          description="VirtualBox или Hyper-V + x86-64 HAOS. Мрежата трябва да е bridged."
          onClick={() => onChange("windows")}
        />
        <ChoiceCard
          selected={value === "linux"}
          title={TEST_OS_LABELS.linux}
          description="KVM/Virt-Manager или VirtualBox + x86-64 HAOS."
          onClick={() => onChange("linux")}
        />
      </div>
    </div>
  );
}

function ScaleStep({
  rooms,
  budgetLevel,
  onRooms,
  onBudgetLevel,
}: {
  rooms: number;
  budgetLevel: BudgetLevel;
  onRooms: (n: number) => void;
  onBudgetLevel: (b: BudgetLevel) => void;
}) {
  const amounts = budgetAmountsForRooms(rooms);

  return (
    <div>
      <h2 className="text-[24px] font-extrabold text-primary">
        Мащаб и бюджет
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Бюджетните суми се преизчисляват според броя стаи — ориентир за хардуер,
        не твърд калкулатор.
      </p>

      <div className="mt-8 rounded-[20px] border-2 border-border/70 bg-surface px-4 py-6">
        <label
          className="block text-center text-[15px] font-bold text-primary"
          htmlFor="rooms"
        >
          Колко стаи планираш?
        </label>
        <p className="mt-3 text-center text-[56px] font-extrabold leading-none tabular-nums tracking-tight text-primary md:text-[64px]">
          {rooms}
          {rooms >= MAX_ROOMS ? (
            <span className="text-[28px] font-bold text-muted-foreground">
              +
            </span>
          ) : null}
        </p>
        <p className="mt-2 text-center text-[13px] text-muted-foreground">
          {rooms >= MAX_ROOMS
            ? "10 или повече — бюджетът е долна граница (≥)"
            : rooms === 1
              ? "стая"
              : "стаи"}
        </p>
        <input
          id="rooms"
          type="range"
          min={1}
          max={MAX_ROOMS}
          value={rooms}
          onChange={(e) => onRooms(Number(e.target.value))}
          className="rooms-slider mt-6 w-full"
          aria-valuemin={1}
          aria-valuemax={MAX_ROOMS}
          aria-valuenow={rooms}
        />
        <div className="mt-2 flex justify-between text-[13px] font-medium text-muted-foreground">
          <span>1</span>
          <span>10+</span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[15px] font-bold text-primary">Бюджет за пилота</p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Цените се обновяват с плъзгача за стаи.
        </p>
        <div className="mt-3 space-y-2">
          {BUDGET_LEVELS.map((level) => (
            <ChoiceCard
              key={level}
              selected={budgetLevel === level}
              recommended={level === RECOMMENDED_BUDGET}
              title={BUDGET_LEVEL_TITLES[level]}
              priceLabel={formatBudgetLabel(amounts[level], rooms)}
              description={budgetLevelDescription(level, rooms)}
              onClick={() => onBudgetLevel(level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStep({
  draft,
  suggestion,
}: {
  draft: Draft;
  suggestion: { strategy: VoiceStrategy; reason: string };
}) {
  const amount = budgetAmountFor(draft.rooms, draft.budgetLevel);

  return (
    <div>
      <h2 className="text-[24px] font-extrabold text-primary">Готово</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Планът ще се настрои според избора ти. Можеш да се върнеш към тази
        настройка по всяко време.
      </p>

      <dl className="mt-6 space-y-3 rounded-[16px] border border-border/60 px-4 py-4 text-[15px]">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Глас</dt>
          <dd className="font-semibold text-primary text-right">
            {VOICE_STRATEGY_LABELS[draft.voiceStrategy]}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Тест</dt>
          <dd className="font-semibold text-primary text-right">
            {TEST_OS_LABELS[draft.testOs]}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Стаи</dt>
          <dd className="font-semibold text-primary text-right">
            {draft.rooms}
            {draft.rooms >= MAX_ROOMS ? "+" : ""}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Бюджет</dt>
          <dd className="font-semibold text-primary text-right">
            {BUDGET_LEVEL_TITLES[draft.budgetLevel]} ·{" "}
            {formatBudgetLabel(amount, draft.rooms)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Сървър</dt>
          <dd className="font-semibold text-primary text-right">
            Home Assistant OS
          </dd>
        </div>
      </dl>

      {suggestion.strategy !== draft.voiceStrategy ? (
        <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
          Съвет (не задължителен): при тези стаи/бюджет често пасва{" "}
          <span className="font-semibold text-primary">
            {VOICE_STRATEGY_LABELS[suggestion.strategy]}
          </span>
          . {suggestion.reason}
        </p>
      ) : (
        <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
          {suggestion.reason}
        </p>
      )}
    </div>
  );
}
