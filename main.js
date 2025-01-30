// script.js

document.addEventListener('DOMContentLoaded', () => {
  const gameTitles = document.querySelectorAll('.game-title');
  const gameContainers = document.querySelectorAll('.game-container');

  gameTitles.forEach(title => {
    title.addEventListener('click', () => {
      const gameId = title.getAttribute('data-game');
      gameContainers.forEach(container => {
        if (container.id === gameId) {
          container.style.display = 'block';
        } else {
          container.style.display = 'none';
        }
      });
    });
  });
});

const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
let flippedCards = [];
let matchedCards = [];
let scorePlayer1 = 0; // プレイヤー1のスコア
let scorePlayer2 = 0; // プレイヤー2のスコア
let currentPlayer = 1; // 現在のターン（1 = プレイヤー1, 2 = プレイヤー2）
let gameOver = false;

// 13種類のトランプカード画像のパス（画像ファイルはプロジェクト内のimagesフォルダに配置）
const cardImages = [
  'images/Supe-doA.png', 'images/Supe-do2.png', 'images/Supe-do3.png', 'images/Supe-do4.png', 'images/Supe-do5.png',
  'images/Supe-do6.png', 'images/Supe-do7.png', 'images/Supe-do8.png', 'images/Supe-do9.png', 'images/Supe-do10.png',
  'images/Supe-do11.png', 'images/Supe-do12.png', 'images/Supe-do13.png'
];

// シャッフルしてカードに割り当て
const shuffledCards = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);

shuffledCards.forEach((imagePath, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.image = imagePath; // 画像のパスをデータ属性に格納
  card.innerHTML = '<span class="card-back">?</span>'; // 裏面のテキスト
  card.addEventListener('click', () => flipCard(card));
  board.appendChild(card);
});

function flipCard(card) {
  if (card.classList.contains('flipped') || flippedCards.length === 2 || gameOver) return;

  card.classList.add('flipped');
  const img = document.createElement('img');
  img.src = card.dataset.image; // 画像のパスを設定
  img.alt = 'Card Image';
  card.innerHTML = ''; // 既存のテキストを消す
  card.appendChild(img); // 画像をカードに追加

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    matchedCards.push(card1, card2);
    if (currentPlayer === 1) {
      scorePlayer1 += 10; // プレイヤー1に得点を加算
    } else {
      scorePlayer2 += 10; // プレイヤー2に得点を加算
    }
    flippedCards = [];
    updateScore();
    
    if (matchedCards.length === shuffledCards.length) {
      setTimeout(() => {
        gameOver = true;
        alert(getWinner());
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.innerHTML = '<span class="card-back">?</span>';
      card2.innerHTML = '<span class="card-back">?</span>';
      flippedCards = [];
      currentPlayer = currentPlayer === 1 ? 2 : 1; // プレイヤーターンを交代
    }, 1000);
  }
}

function updateScore() {
  scoreDisplay.textContent = `Player 1: ${scorePlayer1} | Player 2: ${scorePlayer2}`;
}

function getWinner() {
  if (scorePlayer1 > scorePlayer2) {
    return 'Player 1 wins!';
  } else if (scorePlayer2 > scorePlayer1) {
    return 'Player 2 wins!';
  } else {
    return 'It\'s a tie!';
  }
}

document.addEventListener("DOMContentLoaded", function() {
    // ゲームの状態を管理する変数
    let musicScore = 0;
    let gameStarted = false;
    let currentTime = 0;
    let beatTimes = [
        { time: 5, key: '1' }, // 5秒後に「1」を押す
        { time: 10, key: '2' }, // 10秒後に「2」を押す
        { time: 15, key: '3' }, // 15秒後に「3」を押す
    ];
    let musicPlayer = document.getElementById("music-player");
    let scoreDisplay = document.getElementById("music-score"); // これでエラー回避
    let startButton = document.getElementById("start-button");
    let gameButtons = document.getElementById("game-buttons");

    // ゲーム開始ボタンのイベント
    startButton.addEventListener("click", function() {
        startGame();
    });

    // ゲームを開始する関数
    function startGame() {
        gameStarted = true;
        startButton.style.display = "none"; // ゲーム開始ボタンを非表示にする
        gameButtons.style.display = "flex"; // ボタンを表示する
        updateScore(); // スコアを初期化
        setInterval(checkMusicTiming, 100); // 音楽の進行をチェック
    }

    // 音楽の進行を監視し、ボタンのタイミングを確認
    function checkMusicTiming() {
        const player = document.getElementById("music-player");
        currentTime = player.contentWindow.document.getElementById('movie_player').getCurrentTime(); // 音楽の再生時間を取得

        // 音楽の進行時間に合わせてボタンをアクティブにする
        beatTimes.forEach(beat => {
            if (Math.abs(currentTime - beat.time) < 1) { // 1秒以内のズレを許容
                activateButton(beat.key);
            }
        });
    }

    // ボタンをアクティブにする関数
    function activateButton(key) {
        const button = document.getElementById(`key${key}`);
        button.classList.add('active'); // ボタンをアクティブにする
    }

    // ボタンがクリックされたときの処理
    function handleButtonClick(key) {
        const activeButton = document.getElementById(`key${key}`);
        if (activeButton && activeButton.classList.contains('active')) {
            musicScore++; // スコアを加算
            activeButton.classList.remove('active'); // ボタンのアクティブ状態を解除
            updateScore(); // スコアを更新
        }
    }

    // スコアを表示する関数
    function updateScore() {
        if (scoreDisplay) {
            scoreDisplay.textContent = musicScore;
        }
    }

    // キーボードの入力を監視
    document.addEventListener('keydown', function(event) {
        if (!gameStarted) return;

        if (event.key === '1') {
            handleButtonClick('1');
        } else if (event.key === '2') {
            handleButtonClick('2');
        } else if (event.key === '3') {
            handleButtonClick('3');
        }
    });

    // ボタンがクリックされたときのイベントリスナーを追加
    document.getElementById('key1').addEventListener('click', function() { handleButtonClick('1'); });
    document.getElementById('key2').addEventListener('click', function() { handleButtonClick('2'); });
    document.getElementById('key3').addEventListener('click', function() { handleButtonClick('3'); });
});


$(document).ready(function () {
  let player1Hp = 100;
  let player2Hp = 100;
  let player1AttackPower = 0;
  let player2AttackPower = 0;
  let turn = 'player1';
  let player1TurnSlowed = false; // プレイヤー1のターン遅延フラグ
  let player2TurnSlowed = false; // プレイヤー2のターン遅延フラグ

  // ゲーム開始ボタンがクリックされた際にランダムな攻撃力を設定
  $('#start-btn').click(function () {
      player1AttackPower = Math.floor(Math.random() * 11) + 10; // 10から20の範囲
      player2AttackPower = Math.floor(Math.random() * 11) + 10; // 10から20の範囲
      
      $('#player1-attack').text(player1AttackPower);
      $('#player2-attack').text(player2AttackPower);

      // ボタンを有効化
      $('#attack-btn').prop('disabled', false);
      $('#heal-btn').prop('disabled', false);
      $('#item-btn').prop('disabled', false);

      $('#start-btn').prop('disabled', true);
      $('#result').text('');
      $('#message-log').empty();  // ゲーム開始時にログをクリア

      // 初期ターンの矢印表示
      updateTurnIndicator();
  });

  // 攻撃ボタンがクリックされた際にダメージを与える
  $('#attack-btn').click(function () {
      let attackPower;
      let message = '';

      // メッセージログをクリア
      $('#message-log').empty(); 

      if (turn === 'player1') {
          if (!player1TurnSlowed) {
              attackPower = player1AttackPower;
              player2Hp -= attackPower;
              $('#player2-hp').text(player2Hp);
              message = `プレイヤー1がプレイヤー2に攻撃！ ダメージ: ${attackPower}`;
          } else {
              message = 'プレイヤー1のターンは遅れています!';
              player1TurnSlowed = false;
          }
          turn = 'player2';
          $('#turn').text('プレイヤー2');
      } else if (turn === 'player2') {
          if (!player2TurnSlowed) {
              attackPower = player2AttackPower;
              player1Hp -= attackPower;
              $('#player1-hp').text(player1Hp);
              message = `プレイヤー2がプレイヤー1に攻撃！ ダメージ: ${attackPower}`;
          } else {
              message = 'プレイヤー2のターンは遅れています!';
              player2TurnSlowed = false;
          }
          turn = 'player1';
          $('#turn').text('プレイヤー1');
      }

      $('#result').text(message);
      logMessage(message);
      checkWinner();
      updateTurnIndicator();  // ターンが切り替わったら矢印を更新
  });

  // 回復ボタン
  $('#heal-btn').click(function () {
      let healAmount = Math.floor(Math.random() * 21) + 10; // 10から30の間でランダムに回復
      let message = '';
      
      // プレイヤー1の回復
      if (turn === 'player1') {
          player1Hp = Math.min(player1Hp + healAmount, 100); // 回復量を加算し、最大100に制限
          $('#player1-hp').text(player1Hp);
          message = `プレイヤー1が回復！ 回復量: ${healAmount}`;
          turn = 'player2';
          $('#turn').text('プレイヤー2');
      } 
      // プレイヤー2の回復
      else if (turn === 'player2') {
          player2Hp = Math.min(player2Hp + healAmount, 100); // 回復量を加算し、最大100に制限
          $('#player2-hp').text(player2Hp);
          message = `プレイヤー2が回復！ 回復量: ${healAmount}`;
          turn = 'player1';
          $('#turn').text('プレイヤー1');
      }
      
      $('#result').text(message);
      logMessage(message);
      checkWinner();
      updateTurnIndicator();  // ターンが切り替わったら矢印を更新
  });

  // アイテムボタン
  $('#item-btn').click(function () {
      let message = '';
      if (turn === 'player1') {
          if (Math.random() > 0.5) {
              player2TurnSlowed = true;
              message = 'プレイヤー2のターンが遅くなった！';
          } else {
              message = 'アイテム効果が発動しませんでした。';
          }
          turn = 'player2';
          $('#turn').text('プレイヤー2');
      } else if (turn === 'player2') {
          if (Math.random() > 0.5) {
              player1TurnSlowed = true;
              message = 'プレイヤー1のターンが遅くなった！';
          } else {
              message = 'アイテム効果が発動しませんでした。';
          }
          turn = 'player1';
          $('#turn').text('プレイヤー1');
      }

      $('#result').text(message);
      logMessage(message);

      // 次のターンで遅延効果のメッセージを消す
      setTimeout(function () {
          $('#result').text('');
      }, 1000);

      checkWinner();
      updateTurnIndicator();  // ターンが切り替わったら矢印を更新
  });

  // 勝者をチェック
  function checkWinner() {
      if (player1Hp <= 0) {
          $('#result').text('プレイヤー2の勝利！');
          disableButtons();
      } else if (player2Hp <= 0) {
          $('#result').text('プレイヤー1の勝利！');
          disableButtons();
      }
  }

  // ボタンを無効化する
  function disableButtons() {
      $('#attack-btn').prop('disabled', true);
      $('#heal-btn').prop('disabled', true);
      $('#item-btn').prop('disabled', true);
  }

  // メッセージログにメッセージを追加する
  function logMessage(message) {
      $('#message-log').append('<li>' + message + '</li>');
      // 最後のメッセージが表示されるようにスクロール
      $('#message-log').scrollTop($('#message-log')[0].scrollHeight);
  }

  // ターンインジケーターを更新
  function updateTurnIndicator() {
      if (turn === 'player1') {
          $('#arrow1').addClass('visible'); // プレイヤー1の矢印を表示
          $('#arrow2').removeClass('visible'); // プレイヤー2の矢印を非表示
      } else if (turn === 'player2') {
          $('#arrow2').addClass('visible'); // プレイヤー2の矢印を表示
          $('#arrow1').removeClass('visible'); // プレイヤー1の矢印を非表示
      }
  }
});

document.addEventListener("DOMContentLoaded", () => {
    // クイズデータに18問を追加
    const quizData = [
        {
            question: "この県の震源地名は何",
            image: "./images/岐阜県震源地名.png",
            options: ["岐阜県美濃東部", "岐阜県飛騨地方", "岐阜県美濃中部", "岐阜県美濃中西部"],
            answer: "岐阜県飛騨地方",
            hint: "上の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/岐阜県震源地名２.png",
            options: ["岐阜県美濃東部", "岐阜県美濃中部", "岐阜県飛騨地方", "岐阜県美濃中西部"],
            answer: "岐阜県美濃中西部",
            hint: "左の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/岐阜県震源地名３.png",
            options: ["岐阜県美濃中部", "岐阜県美濃中西部", "岐阜県飛騨地方", "岐阜県美濃東部"],
            answer: "岐阜県美濃東部",
            hint: "右の方です"
        },
        //愛知県
        {
            question: "この県の震源地名は何",
            image: "./images/愛知県震源地名.png",
            options: ["愛知県中部", "愛知県東部", "愛知県西部", "三河湾"],
            answer: "愛知県西部",
            hint: "県から見て左です。"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/愛知県震源地名２.png",
            options: ["愛知県西部", "愛知県中部", "愛知県東部", "三河湾"],
            answer: "愛知県東部",
            hint: "県から見て右です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/愛知県震源地名３.png",
            options: ["愛知県中部", "愛知県西部", "三河湾", "愛知県東部"],
            answer: "三河湾",
            hint: "下の方です。"
        },
        //三重県
        {
            question: "この県の震源地名は何",
            image: "./images/三重県震源地名.png",
            options: ["三重県北部", "三重県南部", "三重県中西部", "三重県中南部"],
            answer: "三重県北部",
            hint: "上です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/三重県震源地名２.png",
            options: ["三重県中西部", "三重県北部", "三重県中北部", "三重県中部"],
            answer: "三重県中部",
            hint: "真ん中です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/三重県震源地名３.png",
            options: ["三重県中南部", "三重県南部", "三重県北部", "三重県中北部南部"],
            answer: "三重県南部",
            hint: "下の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/三重県震源地名４.png",
            options: ["伊勢湾", "三重県南方沖", "東海道南方沖", "三河湾"],
            answer: "伊勢湾",
            hint: "三重県に近いです"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/三重県震源地名５.png",
            options: ["三重県南東方沖", "三重県南方沖", "東海道南方沖", "三重県西方沖"],
            answer: "三重県南方沖",
            hint: "三重県に近いです"
        },
        //静岡県
        {
            question: "この県の震源地名は何",
            image: "./images/静岡県震源地名.png",
            options: ["静岡県東部", "静岡県西部", "静岡県中東部", "静岡県南部"],
            answer: "静岡県西部",
            hint: "左の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/静岡県震源地名２.png",
            options: ["静岡県東部", "静岡県西部", "静岡県中東部", "静岡県中部"],
            answer: "静岡県中部",
            hint: "マンなkの方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/静岡県震源地名３.png",
            options: ["静岡県東部", "静岡県西部", "静岡県中東部", "静岡県中部"],
            answer: "静岡県東部",
            hint: "上の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/静岡県震源地名４.png",
            options: ["静岡県伊豆地方", "静岡県伊豆諸島", "静岡県遠州地方", "静岡県伊豆南部"],
            answer: "静岡県伊豆地方",
            hint: "下の方です"
        },
        {
            question: "この県の震源地名は何",
            image: "./images/静岡県震源地名５.png",
            options: ["遠州灘", "周防灘", "相模湾", "芸予灘"],
            answer: "遠州灘",
            hint: "静岡県の沖です"
        },
        {
            question: "この県の震源地名は何？",
            image: "./images/静岡県震源地名６.png",
            options: ["遠州灘", "周防灘", "駿河湾", "紀伊水道"],
            answer: "駿河湾",
            hint: "静岡県の沖です"
        },
        {
            question: "この県の震源地名は何？",
            image: "./images/静岡県震源地名７.png",
            options: ["駿河湾南方沖", "駿河湾西方沖", "駿河湾東方沖", "駿河湾南東方沖"],
            answer: "駿河湾南方沖",
            hint: "駿河湾震源の下です"
        },
        {
            question: "この県の震源地名は何？",
            image: "./images/静岡県震源地名８.png",
            options: ["伊豆諸島", "伊豆半島西方沖", "伊豆半島東方沖", "伊豆半島南方沖"],
            answer: "伊豆半島東方沖",
            hint: "静岡県の右です"
        }
    ];

    // シャッフル関数
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    // 初期化
    let currentScore = 0;
    let currentQuestionIndex = 0;
    const totalQuestions = 18;
    const shuffledQuiz = shuffle([...quizData]).slice(0, totalQuestions);

    // 要素取得
    const quizImage = document.getElementById("quiz-image");
    const quizOptions = document.querySelectorAll(".quiz-option");
    const quizScore = document.getElementById("quiz-score");
    const currentQuestion = document.getElementById("current-question");
    const hintBtn = document.getElementById("hint-btn");
    const hintContainer = document.getElementById("hint-container");
    const hintText = document.getElementById("hint-text");

    // クイズ設定
    const loadQuestion = () => {
        const currentQuiz = shuffledQuiz[currentQuestionIndex];
        quizImage.src = currentQuiz.image;
        quizImage.alt = currentQuiz.question;
        quizOptions.forEach((btn, index) => {
            btn.textContent = currentQuiz.options[index];
            btn.classList.remove("btn-success", "btn-danger");
            btn.disabled = false;
        });

        // ヒントボタンを表示
        hintContainer.style.display = "none"; // 新しい質問ごとにヒントを非表示にする
    };

    // 回答処理
    const handleAnswer = (selectedOption) => {
        const currentQuiz = shuffledQuiz[currentQuestionIndex];
        if (selectedOption.textContent === currentQuiz.answer) {
            selectedOption.classList.add("btn-success");
            currentScore++;
        } else {
            selectedOption.classList.add("btn-danger");
        }

        quizOptions.forEach((btn) => (btn.disabled = true));
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < totalQuestions) {
                currentQuestion.textContent = currentQuestionIndex + 1;
                quizScore.textContent = currentScore;
                loadQuestion();
            } else {
                // ゲーム終了
                alert(`ゲーム終了！あなたのスコアは ${currentScore} / ${totalQuestions} です！`);
                location.reload();
            }
        }, 1000);
    };

    // ヒントボタンの動作
    hintBtn.addEventListener("click", () => {
        const currentQuiz = shuffledQuiz[currentQuestionIndex];
        hintText.textContent = currentQuiz.hint; // ヒントを表示
        hintContainer.style.display = "block"; // ヒントを表示
    });

    // オプションボタンにイベントリスナー追加
    quizOptions.forEach((btn) => {
        btn.addEventListener("click", () => handleAnswer(btn));
    });

    // クイズ開始
    currentQuestion.textContent = currentQuestionIndex + 1;
    quizScore.textContent = currentScore;
    loadQuestion();
});

// ...existing code...

// テトリスの設定
const tetrisBoard = document.getElementById('tetris-board');
const nextPieceBoard = document.getElementById('next-piece-board');
const tetrisScoreDisplay = document.getElementById('tetris-score');
const tetrisStartBtn = document.getElementById('tetris-start-btn');
const tetrisRestartBtn = document.getElementById('tetris-restart-btn');
const highScoresList = document.getElementById('high-scores-list');
const rows = 20;
const cols = 10;
let tetrisScore = 0;
let tetrisInterval;
let currentPiece;
let nextPiece;
let currentPosition;
let currentRotation;
let boardState;
let highScores = [];

// テトリスのボードを初期化
const createBoard = () => {
  tetrisBoard.innerHTML = '';
  boardState = Array(rows * cols).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      tetrisBoard.appendChild(cell);
    }
  }
};

// 次のピースのボードを初期化
const createNextPieceBoard = () => {
  nextPieceBoard.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      nextPieceBoard.appendChild(cell);
    }
  }
};

// 次のピースを描画
const drawNextPiece = () => {
  createNextPieceBoard();
  nextPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = y * 4 + x;
        nextPieceBoard.children[index].classList.add('filled');
      }
    });
  });
};

// テトリスのピース
const pieces = [
  {
    shape: [
      [1, 1, 1, 1], // I
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    rotations: 2
  },
  {
    shape: [
      [1, 1, 1], // T
      [0, 1, 0],
      [0, 0, 0]
    ],
    rotations: 4
  },
  {
    shape: [
      [1, 1, 0], // Z
      [0, 1, 1],
      [0, 0, 0]
    ],
    rotations: 2
  },
  {
    shape: [
      [0, 1, 1], // S
      [1, 1, 0],
      [0, 0, 0]
    ],
    rotations: 2
  },
  {
    shape: [
      [1, 1, 1], // L
      [1, 0, 0],
      [0, 0, 0]
    ],
    rotations: 4
  },
  {
    shape: [
      [1, 1, 1], // J
      [0, 0, 1],
      [0, 0, 0]
    ],
    rotations: 4
  },
  {
    shape: [
      [1, 1], // O
      [1, 1]
    ],
    rotations: 1
  }
];

// ピースを描画
const drawPiece = () => {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
        tetrisBoard.children[index].classList.add('filled');
      }
    });
  });
};

// ピースを消去
const undrawPiece = () => {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
        tetrisBoard.children[index].classList.remove('filled');
      }
    });
  });
};

// ピースが範囲内にあるかチェック
const isValidMove = (position, shape = currentPiece.shape) => {
  return shape.every((row, y) => {
    return row.every((cell, x) => {
      if (!cell) return true;
      const newPos = (position.y + y) * cols + (position.x + x);
      const row = position.y + y;
      const col = position.x + x;
      return row >= 0 && row < rows && col >= 0 && col < cols && !boardState[newPos];
    });
  });
};

// ピースを固定
const freezePiece = () => {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
        boardState[index] = 1;
      }
    });
  });
};

// ピースを移動
const movePiece = (direction) => {
  const newPosition = { x: currentPosition.x + direction.x, y: currentPosition.y + direction.y };
  if (isValidMove(newPosition)) {
    undrawPiece();
    currentPosition = newPosition;
    drawPiece();
  } else if (direction.y === 1) {
    freezePiece();
    checkForCompleteLines();
    generateNewPiece();
  }
};

// ピースを回転
const rotatePiece = () => {
  undrawPiece();
  const newShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[index]).reverse());
  const newPiece = { ...currentPiece, shape: newShape };
  if (isValidMove(currentPosition, newShape)) {
    currentPiece.shape = newShape;
  }
  drawPiece();
};

// ピースを逆回転
const rotatePieceCounterClockwise = () => {
  undrawPiece();
  const newShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[row.length - 1 - index]));
  const newPiece = { ...currentPiece, shape: newShape };
  if (isValidMove(currentPosition, newShape)) {
    currentPiece.shape = newShape;
  }
  drawPiece();
};

// ピースを落下
const dropPiece = () => {
  movePiece({ x: 0, y: 1 });
};

// 新しいピースを生成
const generateNewPiece = () => {
  currentPiece = nextPiece;
  nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
  currentPosition = { x: Math.floor(cols / 2) - 1, y: 0 };
  if (!isValidMove(currentPosition)) {
    clearInterval(tetrisInterval);
    tetrisStartBtn.style.display = 'none';
    tetrisRestartBtn.style.display = 'block';
    updateHighScores(tetrisScore);
    alert('ゲームオーバー');
  } else {
    drawPiece();
    drawNextPiece();
  }
};

// 完成したラインをチェックして削除
const checkForCompleteLines = () => {
  for (let r = 0; r < rows; r++) {
    const rowStart = r * cols;
    const rowEnd = rowStart + cols;
    if (boardState.slice(rowStart, rowEnd).every(cell => cell === 1)) {
      // 完成した行を削除
      boardState.splice(rowStart, cols);
      // 新しい空の行を追加
      boardState.unshift(...Array(cols).fill(0));
      tetrisScore += 10;
      tetrisScoreDisplay.textContent = tetrisScore;
      // ボードを再描画
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === 1) {
          tetrisBoard.children[i].classList.add('filled');
        } else {
          tetrisBoard.children[i].classList.remove('filled');
        }
      }
    }
  }
};

// スコアボードを更新
const updateHighScores = (score) => {
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 10); // 上位10件のみ保持
  localStorage.setItem('highScores', JSON.stringify(highScores)); // ローカルストレージに保存
  highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
};

// ローカルストレージからスコアを読み込む
const loadHighScores = () => {
  const storedScores = localStorage.getItem('highScores');
  if (storedScores) {
    highScores = JSON.parse(storedScores);
    highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
  }
};

// ゲーム開始
const startTetris = () => {
  tetrisStartBtn.style.display = 'none';
  tetrisRestartBtn.style.display = 'none';
  tetrisScore = 0;
  tetrisScoreDisplay.textContent = tetrisScore;
  createBoard();
  nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
  generateNewPiece();
  tetrisInterval = setInterval(dropPiece, 1000);
};

// リスタート
const restartTetris = () => {
  clearInterval(tetrisInterval);
  startTetris();
};

// ページ読み込み時にスコアを読み込む
window.addEventListener('load', loadHighScores);

// イベントリスナー
tetrisStartBtn.addEventListener('click', startTetris);
tetrisRestartBtn.addEventListener('click', restartTetris);
document.addEventListener('keydown', (e) => {
  if (e.key === 'a') movePiece({ x: -1, y: 0 });
  if (e.key === 'd') movePiece({ x: 1, y: 0 });
  if (e.key === 's') dropPiece();
  if (e.key === 'ArrowUp' || e.key === 'Enter') rotatePiece(); // 'ArrowUp'キーまたは'Enter'キーで回転
  if (e.key === 'w') rotatePieceCounterClockwise(); // 'w'キーで逆回転
});


//ブロック崩し
document.addEventListener('DOMContentLoaded', () => {
  const gameTitles = document.querySelectorAll('.game-title');
  const gameContainers = document.querySelectorAll('.game-container');

  gameTitles.forEach(title => {
    title.addEventListener('click', () => {
      const gameId = title.getAttribute('data-game');
      gameContainers.forEach(container => {
        if (container.id === gameId) {
          container.style.display = 'block';
        } else {
          container.style.display = 'none';
        }
      });
    });
  });

  // ブロック崩しゲームのロジック
  const breakoutCanvas = document.getElementById('breakout-canvas');
  const breakoutCtx = breakoutCanvas.getContext('2d');
  const breakoutScoreDisplay = document.getElementById('breakout-score');
  const breakoutStartBtn = document.getElementById('breakout-start-btn');
  const breakoutRestartBtn = document.getElementById('breakout-restart-btn');
  const bgmPlayBtn = document.getElementById('bgm-play-btn');
  const bgmAudio = document.getElementById('bgm-audio');
  const volumeSlider = document.getElementById('volume-slider');
  let breakoutScore = 0;
  let breakoutInterval;
  let ballX = breakoutCanvas.width / 2;
  let ballY = breakoutCanvas.height - 30;
  let ballDX = 2;
  let ballDY = -2;
  const ballRadius = 10;
  const paddleHeight = 10;
  const paddleWidth = 75;
  let paddleX = (breakoutCanvas.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;
  const brickColumnCount = 6; // ブロックの列を6列に増やす
  const brickRowCount = 6; // ブロックの行を6行に設定
  const brickWidth = 60; // ブロックの幅を小さくする
  const brickHeight = 15; // ブロックの高さを小さくする
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  const bricks = [];

  const brickColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5', '#FF8C33']; // 各段の色を設定

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r] }; // 各段の色を設定
    }
  }

  const drawBall = () => {
    breakoutCtx.beginPath();
    breakoutCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    breakoutCtx.fillStyle = '#00CC99';
    breakoutCtx.fill();
    breakoutCtx.closePath();
  };

  const drawPaddle = () => {
    breakoutCtx.beginPath();
    breakoutCtx.rect(paddleX, breakoutCanvas.height - paddleHeight, paddleWidth, paddleHeight);
    breakoutCtx.fillStyle = '#0095DD';
    breakoutCtx.fill();
    breakoutCtx.closePath();
  };

  const drawBricks = () => {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          breakoutCtx.beginPath();
          breakoutCtx.rect(brickX, brickY, brickWidth, brickHeight);
          breakoutCtx.fillStyle = bricks[c][r].color; // ブロックの色を設定
          breakoutCtx.fill();
          breakoutCtx.closePath();
        }
      }
    }
  };

  const draw = () => {
    breakoutCtx.clearRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ballX + ballDX > breakoutCanvas.width - ballRadius || ballX + ballDX < ballRadius) {
      ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
      ballDY = -ballDY;
    } else if (ballY + ballDY > breakoutCanvas.height - ballRadius) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballDY = -ballDY;
      } else {
        clearInterval(breakoutInterval);
        breakoutRestartBtn.style.display = 'block';
        bgmAudio.pause(); // ゲームオーバー時にBGMを停止
        alert('ゲームオーバー');
      }
    }

    if (rightPressed && paddleX < breakoutCanvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    ballX += ballDX;
    ballY += ballDY;
  };

  const collisionDetection = () => {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ballX + ballRadius > b.x &&
            ballX - ballRadius < b.x + brickWidth &&
            ballY + ballRadius > b.y &&
            ballY - ballRadius < b.y + brickHeight
          ) {
            ballDY = -ballDY;
            b.status = 0;
            breakoutScore++;
            breakoutScoreDisplay.textContent = breakoutScore;
            if (breakoutScore === brickRowCount * brickColumnCount) {
              clearInterval(breakoutInterval);
              breakoutRestartBtn.style.display = 'block';
              bgmAudio.pause(); // すべてのブロックを壊したときにBGMを停止
              alert('おめでとうございます！ あなたはすべてのブロックを壊しました！');
            }
          }
        }
      }
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = true;
    }
  };

  const keyUpHandler = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = false;
    }
  };

  const resetGame = () => {
    clearInterval(breakoutInterval);
    breakoutScore = 0;
    breakoutScoreDisplay.textContent = breakoutScore;
    ballX = breakoutCanvas.width / 2;
    ballY = breakoutCanvas.height - 30;
    ballDX = 2;
    ballDY = -2;
    paddleX = (breakoutCanvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
      }
    }
    breakoutRestartBtn.style.display = 'none';
    breakoutInterval = setInterval(draw, 10);
    bgmAudio.play(); // ゲームリセット時にBGMを再生
  };

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  breakoutStartBtn.addEventListener('click', () => {
    breakoutStartBtn.style.display = 'none';
    breakoutInterval = setInterval(draw, 10);
    bgmAudio.play(); // ゲーム開始時にBGMを再生
  });

  breakoutRestartBtn.addEventListener('click', resetGame);

  bgmPlayBtn.addEventListener('click', () => {
    if (bgmAudio.paused) {
      bgmAudio.play();
      bgmPlayBtn.textContent = 'BGM停止';
    } else {
      bgmAudio.pause();
      bgmPlayBtn.textContent = 'BGM再生';
    }
  });

  volumeSlider.addEventListener('input', () => {
    bgmAudio.volume = volumeSlider.value;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const gameTitles = document.querySelectorAll('.game-title');
  const gameContainers = document.querySelectorAll('.game-container');

  gameTitles.forEach(title => {
    title.addEventListener('click', () => {
      const gameId = title.getAttribute('data-game');
      gameContainers.forEach(container => {
        if (container.id === gameId) {
          container.style.display = 'block';
        } else {
          container.style.display = 'none';
        }
      });
    });
  });

  // スネークゲームのロジック
  const snakeCanvas = document.getElementById('snake-canvas');
  const snakeCtx = snakeCanvas.getContext('2d');
  const snakeScoreDisplay = document.getElementById('snake-score');
  const snakeStartBtn = document.getElementById('snake-start-btn');
  const snakeRestartBtn = document.getElementById('snake-restart-btn');
  const highScoresList = document.getElementById('high-scores-list');
  let snakeInterval;
  let snake;
  let food;
  let direction;
  let score;
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

  const initGame = () => {
    snake = [{ x: 10, y: 10 }];
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    direction = { x: 0, y: 0 };
    score = 0;
    snakeScoreDisplay.textContent = score;
    snakeRestartBtn.style.display = 'none';
  };

  const drawSnake = () => {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // 壁を描画
    snakeCtx.strokeStyle = 'green';
    snakeCtx.lineWidth = 4;
    snakeCtx.strokeRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snake.forEach(segment => {
      snakeCtx.fillStyle = 'green';
      snakeCtx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
    snakeCtx.fillStyle = 'red';
    snakeCtx.fillRect(food.x * 20, food.y * 20, 20, 20);
  };

  const moveSnake = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      snakeScoreDisplay.textContent = score;
      food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else {
      snake.pop();
    }
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
      clearInterval(snakeInterval);
      snakeRestartBtn.style.display = 'block';
      saveHighScore(score);
      alert('ゲームオーバー');
    }
  };

  const gameLoop = () => {
    moveSnake();
    drawSnake();
  };

  const saveHighScore = (score) => {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // 上位5つのスコアのみ保存
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
  };

  const displayHighScores = () => {
    highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
  };

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
    }
  });

  snakeStartBtn.addEventListener('click', () => {
    snakeStartBtn.style.display = 'none';
    initGame();
    snakeInterval = setInterval(gameLoop, 100);
  });

  snakeRestartBtn.addEventListener('click', () => {
    initGame();
    snakeInterval = setInterval(gameLoop, 100);
  });

  displayHighScores(); // ページ読み込み時にハイスコアを表示
});

// ゲームの初期化
let canvas = document.getElementById('jumping-game-canvas');
let ctx = canvas.getContext('2d');
let score = 0;
let isJumping = false;
let jumpHeight = 0;
let obstacles = [];
let gameInterval;
let jumpSpeed = 20; // ジャンプ速度を速く設定
let gravity = 0.6;
let isGameOver = false; // ゲームオーバー状態を管理
let obstacleSpeed = 4; // 障害物の速度（変更なし）
let maxJumpHeight = 100;  // ジャンプの最大高さ

// プレイヤー設定
let player = {
    x: 50,
    y: canvas.height - 60, // 地面からの高さ
    width: 40,
    height: 60,
    color: '#32cd32',
};

// 障害物設定
function generateObstacle() {
    // ギャップ高さを広めに設定（100-150px）
    let gapHeight = Math.random() * 100 + 150;  
    let obstacleHeight = canvas.height - gapHeight - 100; // 障害物の上部と下部の高さ

    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 30,
        height: obstacleHeight,
        gapHeight: gapHeight,
        color: '#ff6347',
    });
}

// ジャンプの処理
function jump() {
  if (isJumping) {
      jumpHeight += jumpSpeed; // 連打でジャンプする高さを増加
      if (jumpHeight >= maxJumpHeight) { // 最大高さに達したら上昇を止める
          isJumping = false;
      }
  } else if (jumpHeight > 0) {
      jumpHeight -= gravity; // 重力で下降
  }
}

// ゲームの描画
function draw() {
    if (isGameOver) return; // ゲームオーバー状態なら描画を止める

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面クリア

    // プレイヤーを描画
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y - jumpHeight, player.width, player.height);

    // 障害物を描画
    obstacles.forEach(function(obstacle) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); // 上部の障害物
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.gapHeight, obstacle.width, canvas.height - obstacle.gapHeight); // 下部の障害物
    });

    // 障害物の移動
    obstacles.forEach(function(obstacle, index) {
        obstacle.x -= obstacleSpeed; // 障害物を左に移動
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1); // 画面外に出たら削除
            score++; // スコアを更新
        }
    });

    // ジャンプの制御
    jump();

    // 衝突判定
obstacles.forEach(function(obstacle) {
  // プレイヤーが障害物の間を通り抜けているか
  if (player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width) {
      // プレイヤーの位置が障害物の隙間に収まっているかを確認
      if (player.y - jumpHeight + player.height > obstacle.height && 
          player.y - jumpHeight < obstacle.height + obstacle.gapHeight) {
          // 隙間を通過していない場合、ゲームオーバー
          isGameOver = true;
          clearInterval(gameInterval);
          alert("ゲームオーバー! スコア: " + score);
          document.getElementById("jumping-game-restart-btn").style.display = "block";
      }
  }
});
}


// ゲーム開始
document.getElementById('jumping-game-start-btn').addEventListener('click', function() {
    if (isGameOver) return; // ゲームオーバー後は開始ボタンを無効化

    score = 0;
    obstacles = [];
    isGameOver = false;
    document.getElementById('jumping-game-restart-btn').style.display = "none";
    
    // 障害物をランダムな間隔で生成するための処理
    gameInterval = setInterval(function() {
        if (Math.random() < 0.05) {
            generateObstacle(); // 障害物をランダムで生成
        }
        draw();
    }, 1000 / 60); // 60 FPS
});

// キー入力処理（連打でジャンプを続ける）
document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyA' && !isGameOver) { // Aキーでジャンプ開始
      isJumping = true; // Aキーでジャンプ開始
  }
});

// ゲーム再スタート
document.getElementById('jumping-game-restart-btn').addEventListener('click', function() {
    window.location.reload(); // ページをリロードしてゲームを再スタート
});

