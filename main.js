// script.js

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
