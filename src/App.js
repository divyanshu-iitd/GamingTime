import { useState ,useEffect} from "react";
import "./App.css";
function Controls({onGame}) {
  
  
  const [activeKey, setActiveKey] = useState(""); // store current arrow key

  // useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        setActiveKey(e.key);
      }
      else{
        onGame();
      }
    };

    const handleKeyUp = () => {
      setActiveKey(""); // clear when released
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, []);

  // map the key to emoji or symbol
  const getArrowSymbol = () => {
    switch (activeKey) {
      case "ArrowUp":
        return "⬆️";
      case "ArrowDown":
        return "⬇️";
      case "ArrowLeft":
        return "⬅️";
      case "ArrowRight":
        return "➡️";
      default:
        return "";
    }
  };

  return (
    <div className="game-area">
      <h1>Press any arrow key ⬅️⬆️⬇️➡️</h1>
      {activeKey && (
        <div className="arrow-display">
          {getArrowSymbol()}
        </div>
      )}
      <h1>Press Any Key to Proceed after Learning Controls</h1>
    </div>
  );
}
function Login({onLogin}){
    const [int,setint]=useState("");
    const [name,setname]=useState("");
    return(
      <div className="login">
        <div className="login-box">
        <h1>Welcome to Divyanshu Game</h1>
        <h2>Sign in</h2>
        <form onSubmit={(e)=>{onLogin();}}>
        <input type="text" value={name} placeholder="Username" onChange={(e)=>setname(e.target.value)}/><br/>
        <input type="password" value={int} placeholder="Password" onChange={(e)=>setint(e.target.value)}/>
        <button type="Submit">SignIn</button>
        </form>
        </div>
      </div>
    )
};

function Game() {
  const boardSize = 30; // more cells for fullscreen
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  // const [username, setUsername] = useState("");
  const [cellSize, setCellSize] = useState(20);

  // handle window resize for responsive fullscreen
  useEffect(() => {
    const handleResize = () => {
      const size = Math.floor(Math.min(window.innerWidth, window.innerHeight) / boardSize);
      setCellSize(size);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Arrow key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Snake movement
  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const head = snake[0];
      let newHead;

      switch (direction) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          newHead = { ...head };
          break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= boardSize ||
        newHead.y >= boardSize ||
        snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      let newSnake = [newHead, ...snake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        const newFood = {
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize),
        };
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver]);
return (
  <div className="game-container">
    <h1>Welcome to Snake Game!</h1>

    {gameOver && (
      <>
        <h2 className="game-over">Game Over!</h2>
        <button
          className="restart-button"
          onClick={() => {
            setSnake([{ x: 10, y: 10 }]);
            setFood({ x: 5, y: 5 });
            setDirection("RIGHT");
            setGameOver(false);
          }}
        >
          Restart
        </button>
      </>
    )}

    <div
      className="board"
      style={{
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        width: cellSize * boardSize,
        height: cellSize * boardSize,
      }}
    >
      {Array.from({ length: boardSize * boardSize }).map((_, index) => {
        const x = index % boardSize;
        const y = Math.floor(index / boardSize);

        const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            className={isSnake ? "snake" : isFood ? "food" : ""}
            style={{ width: cellSize, height: cellSize }}
          ></div>
        );
      })}
    </div>
  </div>
);

}



function App() {
  const [page, setPage] = useState("login"); // "login" or "game"

  return (
    <>
      {page === "login" && <Login onLogin={() => setPage("game")} />}
      {page === "game" && <Controls onGame={()=>setPage("ongame")}/>}
      {page === "ongame" && <Game/>}
    </>
  );
}

export default App;
