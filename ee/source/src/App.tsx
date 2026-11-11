import { useEffect, useRef, useState } from "react"
import { objectMasks } from "./generated/objectMasks"

type Page = "home" | "stages" | "cleo" | "hello" | "temp"

const OBJECTS = [
  { id: 1, name: "CAT" },
  { id: 2, name: "DAGGER" },
  { id: 3, name: "SCARAB" },
  { id: 4, name: "SNAKE" },
  { id: 5, name: "HAND MIRROR" },
  { id: 6, name: "GOLDEN COIN" },
  { id: 7, name: " HAIR COMB" },
  { id: 8, name: "Oil lamp" },
] as const

function Icon({
  name,
}: {
  name: "home" | "settings" | "back" | "sound" | "close"
}) {
  const paths = {
    home: <path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9.5 20v-6h5v6" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    back: <path d="m15 18-6-6 6-6" />,
    sound: (
      <>
        <path d="M5 10v4h3l5 4V6l-5 4H5Z" />
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      </>
    ),
    close: <path d="m7 7 10 10M17 7 7 17" />,
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function GoldButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button className={`gold-button ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}

function PageFrame({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <main className={`app-frame ${className}`}>{children}</main>
}

function HomePage({ onStart }: { onStart: () => void }) {
  return (
    <PageFrame className="home-page">
      <section className="home-content">
        <div className="eyebrow"> Dustin Do presents</div>
        <div className="title-ornament">
          <span
            style={
              { "--figma-make-local-effect-type": "None" } as React.CSSProperties
            }
          />
        </div>
        <p style={{ boxShadow: "none" }}>
          <br data-fge-id="fge-29" />
        </p>
        <h1>
          Epic
          <strong
            style={
              { "--figma-make-local-effect-type": "None" } as React.CSSProperties
            }
          >
            ESCAPE
          </strong>
        </h1>
        <GoldButton onClick={onStart} className="start-button">
          Begin the journey
        </GoldButton>
      </section>
      <div className="scene-backdrop home-backdrop" style={{ boxShadow: "none" }} />
      <div className="home-vignette" />
      <div className="bottom-flourish" aria-hidden="true">
        ◆
      </div>
    </PageFrame>
  )
}

function StagesPage({ go }: { go: (page: Page) => void }) {
  return (
    <PageFrame className="stages-page">
      <div className="scene-backdrop stage-scene" />
      <div className="dark-wash" />
      <header className="page-header">
        <button
          className="round-button"
          onClick={() => go("home")}
          aria-label="Back home"
        >
          <Icon name="back" />
        </button>
        <div>
          <span>Choose your path</span>
          <h2>Secrets of the Past</h2>
        </div>
        <div className="header-spacer" />
      </header>
      <section className="stage-list">
        <button className="stage-card active" onClick={() => go("cleo")}>
          <div className="stage-number">I</div>
          <div className="stage-copy">
            <small>Nile Valley, Alexandria · Palace wing</small>
            <strong>Cleopatra&apos;s Chamber</strong>
            <span>8 treasures await</span>
          </div>
          <div className="stage-arrow">›</div>
        </button>
        <GoldButton onClick={() => go("temp")} className="temp-button">
          Cleo temp
        </GoldButton>
        <button className="stage-card" onClick={() => go("hello")}>
          <div className="stage-number">II</div>
          <div className="stage-copy">
            <small> Washington D.C., United States· Coming soon</small>
            <strong>Save Washington&apos;s Portrait</strong>
            <span>Preview chapter</span>
          </div>
          <div className="stage-arrow">›</div>
        </button>
      </section>
      <div className="progress-label">
        <span />1 of 2 expeditions unlocked
        <span />
      </div>
    </PageFrame>
  )
}

function SimplePage({
  type,
  go,
}: {
  type: "hello" | "temp"
  go: (page: Page) => void
}) {
  return (
    <PageFrame className={type === "temp" ? "temp-page" : "simple-page"}>
      {type === "hello" && (
        <img
          className="hello-background"
          src={`${import.meta.env.BASE_URL}assets/washington-preview.jpg`}
          alt=""
        />
      )}
      {type === "temp" && (
        <img src={`${import.meta.env.BASE_URL}assets/cleotemp.png`} alt="Cleopatra chamber artwork" />
      )}
      <div className="simple-shade" />
      <button
        className="round-button simple-back"
        onClick={() => go("stages")}
        aria-label="Back to stages"
      >
        <Icon name="back" />
      </button>
      {type === "hello" && (
        <div className="hello-card">
          <span>Chapter II</span>
          <h2>Hello Traveler.</h2>
          <p>The next expedition is being prepared.</p>
          <GoldButton onClick={() => go("stages")}>
            Return to expeditions
          </GoldButton>
        </div>
      )}
      {type === "temp" && (
        <div className="temp-label">Clean scene study · Cleo temp</div>
      )}
    </PageFrame>
  )
}

function ObjectIcon({ id }: { id: number }) {
  const mask = objectMasks[id - 1]
  const [x1, y1, x2, y2] = mask.bbox
  const scale = Math.min(32 / (x2 - x1 + 1), 32 / (y2 - y1 + 1))
  return (
    <span
      className="object-icon"
      aria-hidden="true"
      style={id === 1 ? { boxShadow: "none" } : undefined}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/c${String(id).padStart(2, "0")}.png`}
        style={{
          width: 1320 * scale,
          height: 2868 * scale,
          left: -x1 * scale + (40 - (x2 - x1 + 1) * scale) / 2,
          top: -y1 * scale + (40 - (y2 - y1 + 1) * scale) / 2,
        }}
      />
    </span>
  )
}

function isMaskHit(id: number, x: number, y: number, padding: number) {
  const mask = objectMasks[id - 1]
  const [x1, y1, x2, y2] = mask.bbox
  if (
    x < x1 - padding ||
    x > x2 + padding ||
    y < y1 - padding ||
    y > y2 + padding
  )
    return false
  const minRow = Math.max(0, Math.floor(y - padding) - y1)
  const maxRow = Math.min(mask.runs.length - 1, Math.ceil(y + padding) - y1)
  for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
    const dy = Math.abs(y - (y1 + rowIndex))
    const xPad = Math.sqrt(Math.max(0, padding * padding - dy * dy))
    const row = mask.runs[rowIndex]
    for (let i = 0; i < row.length; i += 2) {
      if (x >= row[i] - xPad && x <= row[i + 1] + xPad) return true
    }
  }
  return false
}

type Flight = { id: number; dx: number; dy: number } | null

function GamePage({ go }: { go: (page: Page) => void }) {
  const frameRef = useRef<HTMLElement>(null)
  const clueRefs = useRef<(HTMLDivElement | null)[]>([])
  const [found, setFound] = useState<number[]>([])
  const [flight, setFlight] = useState<Flight>(null)
  const [bursting, setBursting] = useState<number | null>(null)
  const [settings, setSettings] = useState(false)
  const [sound, setSound] = useState(true)
  const [haptics, setHaptics] = useState(true)

  useEffect(() => {
    if (!flight) return
    const finish = window.setTimeout(() => {
      setFound((current) => [...current, flight.id])
      setBursting(flight.id)
      setFlight(null)
      window.setTimeout(() => setBursting(null), 600)
    }, 820)
    return () => window.clearTimeout(finish)
  }, [flight])

  const handleBoardTap = (event: React.PointerEvent<HTMLElement>) => {
    if (flight || settings) return
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const naturalX = ((event.clientX - rect.left) / rect.width) * 1320
    const naturalY = ((event.clientY - rect.top) / rect.height) * 2868
    const sourcePadding = (5 / rect.width) * 1320
    const item = [...OBJECTS]
      .reverse()
      .find(
        (object) =>
          !found.includes(object.id) &&
          isMaskHit(object.id, naturalX, naturalY, sourcePadding),
      )
    if (!item) return
    const clueRect = clueRefs.current[item.id - 1]?.getBoundingClientRect()
    const [x1, y1, x2, y2] = objectMasks[item.id - 1].bbox
    const objectX = rect.left + ((x1 + x2) / 2 / 1320) * rect.width
    const objectY = rect.top + ((y1 + y2) / 2 / 2868) * rect.height
    const targetX = clueRect
      ? clueRect.left + clueRect.width / 2
      : rect.left + rect.width / 2
    const targetY = clueRect
      ? clueRect.top + clueRect.height / 2
      : rect.top + rect.height / 5
    if (haptics && navigator.vibrate) navigator.vibrate(18)
    setFlight({ id: item.id, dx: targetX - objectX, dy: targetY - objectY })
  }

  const resetGame = () => {
    setFound([])
    setFlight(null)
    setBursting(null)
    setSettings(false)
  }

  return (
    <main
      ref={frameRef}
      className="app-frame game-page"
      onPointerUp={handleBoardTap}
    >
      <img
        className="game-background"
        src={`${import.meta.env.BASE_URL}assets/cleotemp.png`}
        alt="An opulent Egyptian royal chamber"
        draggable={false}
      />
      {OBJECTS.map((object) => {
        const hidden = found.includes(object.id) || flight?.id === object.id
        return (
          <img
            key={object.id}
            className={`placed-object ${hidden ? "object-hidden" : ""}`}
            src={`${import.meta.env.BASE_URL}assets/c${String(object.id).padStart(2, "0")}.png`}
            alt=""
            draggable={false}
          />
        )
      })}
      {flight && (
        <img
          className="flying-object"
          src={`${import.meta.env.BASE_URL}assets/c${String(flight.id).padStart(2, "0")}.png`}
          alt=""
          style={
            {
              "--fly-x": `${flight.dx}px`,
              "--fly-y": `${flight.dy}px`,
              "--origin-x": `${((objectMasks[flight.id - 1].bbox[0] + objectMasks[flight.id - 1].bbox[2]) / 2 / 1320) * 100}%`,
              "--origin-y": `${((objectMasks[flight.id - 1].bbox[1] + objectMasks[flight.id - 1].bbox[3]) / 2 / 2868) * 100}%`,
            } as React.CSSProperties
          }
        />
      )}

      <section className="game-ui" aria-label="Objects to find">
        <div className="game-topbar">
          <button
            className="round-button"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => go("stages")}
            aria-label="Exit to stage selection"
          >
            <Icon name="home" />
          </button>
          <div className="game-heading">
            <span>Cleopatra&apos;s Chamber</span>
            <strong>{8 - found.length} treasures remain</strong>
          </div>
          <button
            className="round-button"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => setSettings(true)}
            aria-label="Open settings"
          >
            <Icon name="settings" />
          </button>
        </div>
        <div className="clue-grid">
          {OBJECTS.map((object) => {
            const isFound = found.includes(object.id)
            const isBursting = bursting === object.id
            return (
              <div
                key={object.id}
                ref={(node) => {
                  clueRefs.current[object.id - 1] = node
                }}
                className={`clue ${isFound ? "clue-found" : ""} ${
                  isBursting ? "clue-burst" : ""
                }`}
              >
                <ObjectIcon id={object.id} />
                <span style={{ fontSize: "12px" }}>{object.name}</span>
                {isBursting && <i className="sparkles" aria-hidden="true" />}
              </div>
            )
          })}
        </div>
      </section>

      <div className="board-instruction">Tap the hidden treasures</div>

      {settings && (
        <div
          className="modal-backdrop"
          onPointerUp={(e) => e.stopPropagation()}
        >
          <section
            className="settings-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
          >
            <button
              className="modal-close"
              onClick={() => setSettings(false)}
              aria-label="Close settings"
            >
              <Icon name="close" />
            </button>
            <span className="modal-kicker">Game menu</span>
            <h2>Settings</h2>
            <button className="setting-row" onClick={() => setSound(!sound)}>
              <span>
                <Icon name="sound" />
                Sound
              </span>
              <i className={sound ? "toggle on" : "toggle"} />
            </button>
            <button
              className="setting-row"
              onClick={() => setHaptics(!haptics)}
            >
              <span>
                <Icon name="settings" />
                Haptics
              </span>
              <i className={haptics ? "toggle on" : "toggle"} />
            </button>
            <GoldButton onClick={resetGame}>Restart expedition</GoldButton>
          </section>
        </div>
      )}

      {found.length === 8 && !bursting && (
        <div
          className="modal-backdrop victory"
          onPointerUp={(e) => e.stopPropagation()}
        >
          <section className="victory-panel">
            <div className="victory-seal">VIII</div>
            <span>Collection complete</span>
            <h2>The chamber is restored</h2>
            <p>
              You recovered every treasure in Cleopatra&apos;s private chamber.
            </p>
            <GoldButton onClick={() => go("stages")}>Continue</GoldButton>
            <button className="text-button" onClick={resetGame}>
              Play again
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")

  return (
    <div className="viewport-shell">
      {page === "home" && <HomePage onStart={() => setPage("stages")} />}
      {page === "stages" && <StagesPage go={setPage} />}
      {page === "cleo" && <GamePage go={setPage} />}
      {(page === "hello" || page === "temp") && (
        <SimplePage type={page} go={setPage} />
      )}
    </div>
  )
}
