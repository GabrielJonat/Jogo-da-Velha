document.addEventListener('DOMContentLoaded', () => {
    const cardsArray = ['./img/maca.webp', './img/banana.png', './img/uva.png', './img/morango.png'];
    const gameBoard = document.querySelector('.game-board');
    const timerElement = document.getElementById('timer');
    let cards = [...cardsArray, ...cardsArray];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timer;
    let timeRemaining = 60; // 3 minutos em segundos
    let matches = 0;

    function shuffle() {
        cards.sort(() => 0.5 - Math.random());
    }

    function createBoard() {
        shuffle();
        cards.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = symbol;

            // Criação de frente e verso do cartão
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            const img = document.createElement('img');
            img.src = symbol;
            img.alt = "imagem da fruta";

            cardFront.appendChild(img);
            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        startTimer();
    }

    function startTimer() {
        timer = setInterval(() => {
            if (timeRemaining <= 0) {
                stopTimer();
                endGame(false);
            } else {
                timeRemaining--;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                timerElement.textContent = `Tempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function endGame(won) {
        stopTimer();
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        const restartButton = document.getElementById('restart-button');
    
        if (won) {
            modalMessage.textContent = `Parabéns! Você encontrou todos os pares com ${timeRemaining} segundos restantes.`;
        } else {
            modalMessage.textContent = "O tempo acabou! Tente novamente.";
        }
    
        modal.style.display = "block"; // Exibe o modal
    
        restartButton.addEventListener('click', () => {
            modal.style.display = "none"; // Oculta o modal
            location.reload(); // Reinicia o jogo
        });
    }
    
    // Função para fechar o modal ao clicar no botão de fechar
    document.querySelector('.close-button').addEventListener('click', () => {
        const modal = document.getElementById('modal');
        modal.style.display = "none"; // Oculta o modal
    });
    
    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = "none"; // Oculta o modal
        }
    });
    

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
        isMatch ? disableCards() : unflipCards();

        if (isMatch) {
            matches += 1;
            if (matches === cardsArray.length) {
                endGame(true);
            }
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    createBoard();
});
