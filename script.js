    const PUZZLE_IMAGE_URL = 'images/tokyo16.jpg';
document.addEventListener('DOMContentLoaded', () => {
    // Envelope modal logic
    const quickModal = document.getElementById('quick-message-modal');
    const quickClose = document.getElementById('quick-message-close');
    const mainContent = document.querySelector('.y2k-container');
    if (quickModal && quickClose && mainContent) {
        mainContent.classList.add('envelope-modal-blur');
        quickModal.style.display = 'flex';
        quickClose.addEventListener('click', () => {
            quickModal.style.display = 'none';
            mainContent.classList.remove('envelope-modal-blur');
        });
    }

    // --- Game Switching Logic ---
    const prevGameBtn = document.getElementById('prev-game-btn');
    const nextGameBtn = document.getElementById('next-game-btn');
    const gameTitle = document.getElementById('game-title');
    const puzzleGameContainer = document.getElementById('puzzle-game-container');
    const mazeGameContainer = document.getElementById('maze-game-container');
    const emoteGameContainer = document.getElementById('emote-game-container');
    const wordsearchGameContainer = document.getElementById('wordsearch-game-container');

    // This function will be replaced by the puzzle's specific resize logic later.
    // This ensures that when we switch games, we can call the right function.
    let resizePuzzleCanvas = () => {};

    if (prevGameBtn && nextGameBtn && gameTitle && puzzleGameContainer && mazeGameContainer && emoteGameContainer) {
        const games = [
            { title: 'A Little Puzzle Game!', container: puzzleGameContainer },
            { title: 'A Cute Maze Adventure!', container: mazeGameContainer },
            { title: 'An Emote-ional Game!', container: emoteGameContainer },
            { title: 'Word Search!', container: wordsearchGameContainer }
        ];
        let currentGameIndex = 0;

        function updateGameDisplay() {
            // Hide all game containers first
            games.forEach(game => game.container.style.display = 'none');
            
            // Show the current game's container
            const currentContainer = games[currentGameIndex].container;
            currentContainer.style.display = 'block';
            gameTitle.textContent = games[currentGameIndex].title;

            // If we just switched to the puzzle game, we must resize its canvas.
            if (currentContainer === puzzleGameContainer) {
                setTimeout(resizePuzzleCanvas, 0);
            }
            // If we just switched to the word search game, render it
            if (currentContainer === wordsearchGameContainer && window.renderWordSearch) {
                setTimeout(window.renderWordSearch, 0);
            }

            // Update button states
            prevGameBtn.disabled = currentGameIndex === 0;
            nextGameBtn.disabled = currentGameIndex === games.length - 1;

            prevGameBtn.classList.toggle('opacity-50', prevGameBtn.disabled);
            prevGameBtn.classList.toggle('cursor-not-allowed', prevGameBtn.disabled);
            nextGameBtn.classList.toggle('opacity-50', nextGameBtn.disabled);
            nextGameBtn.classList.toggle('cursor-not-allowed', nextGameBtn.disabled);
        }

        nextGameBtn.addEventListener('click', () => {
            if (currentGameIndex < games.length - 1) {
                currentGameIndex++;
                updateGameDisplay();
            }
        });

        prevGameBtn.addEventListener('click', () => {
            if (currentGameIndex > 0) {
                currentGameIndex--;
                updateGameDisplay();
            }
        });

        updateGameDisplay();
    }

    // --- Enhanced Puzzle Game Logic ---
    const canvas = document.getElementById('puzzle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const shuffleButton = document.getElementById('shuffle-button');
    
    // Modal elements
    const messageBox = document.getElementById('puzzle-complete-modal');
    const messageText = document.getElementById('puzzle-message-text');
    const messageCloseButton = document.getElementById('puzzle-message-close-button');

    // Only proceed with puzzle logic if the canvas exists
    if (canvas && ctx) {
    const PUZZLE_IMAGE_URL = 'images/tokyo16.jpg';
        const ROWS = 4;
        const COLS = 4;

        let puzzleImage = new Image();
        let puzzlePieces = [];
        let pieceWidth, pieceHeight;

        let isDragging = false;
        let draggedPiece = null;
        let offsetX, offsetY;

        function showMessage(message) {
            if (messageText && messageBox) {
                messageText.textContent = message;
                messageBox.style.display = 'block';
            }
        }

        function hideMessage() {
            if (messageBox) {
                messageBox.style.display = 'none';
            }
        }

        function resizeCanvas() {
            const container = document.getElementById('puzzle-container');
            if (!container) return;
            const newSize = container.clientWidth;

            // Safeguard: If the container is not visible (e.g., display: none),
            // its width will be 0. We should not attempt to resize the canvas
            // in this case, as it would make it invisible.
            if (newSize === 0) {
                return;
            }

            canvas.width = newSize;
            canvas.height = newSize;
            pieceWidth = canvas.width / COLS;
            pieceHeight = canvas.height / ROWS;
            drawPuzzle();
        }
        
        // Make the puzzle's resize function available to the game switching logic
        resizePuzzleCanvas = resizeCanvas;

        function initializeAndShuffle() {
            puzzlePieces = [];
            let positions = [];

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    puzzlePieces.push({
                        originalRow: r, originalCol: c,
                        currentRow: r, currentCol: c,
                    });
                    positions.push({ r, c });
                }
            }

            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }

            puzzlePieces.forEach((piece, index) => {
                piece.currentRow = positions[index].r;
                piece.currentCol = positions[index].c;
            });

            drawPuzzle();
            hideMessage();
        }

        function drawPuzzle() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!puzzleImage.complete || puzzleImage.naturalWidth === 0) {
                ctx.fillStyle = '#FFC0CB';
                ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = "20px VT323";
                ctx.textAlign = "center";
                ctx.fillText("Loading puzzle...", canvas.width/2, canvas.height/2);
                return;
            }

            puzzlePieces.forEach(piece => {
                if (piece === draggedPiece) return;
                const sourceX = piece.originalCol * (puzzleImage.naturalWidth / COLS);
                const sourceY = piece.originalRow * (puzzleImage.naturalHeight / ROWS);
                const sourceWidth = puzzleImage.naturalWidth / COLS;
                const sourceHeight = puzzleImage.naturalHeight / ROWS;
                const destX = piece.currentCol * pieceWidth;
                const destY = piece.currentRow * pieceHeight;

                ctx.drawImage(puzzleImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, pieceWidth, pieceHeight);
                ctx.strokeRect(destX, destY, pieceWidth, pieceHeight);
            });

            if (draggedPiece) {
                const sourceX = draggedPiece.originalCol * (puzzleImage.naturalWidth / COLS);
                const sourceY = draggedPiece.originalRow * (puzzleImage.naturalHeight / ROWS);
                const sourceWidth = puzzleImage.naturalWidth / COLS;
                const sourceHeight = puzzleImage.naturalHeight / ROWS;
                
                ctx.globalAlpha = 0.7;
                ctx.drawImage(puzzleImage, sourceX, sourceY, sourceWidth, sourceHeight, draggedPiece.drawX, draggedPiece.drawY, pieceWidth, pieceHeight);
                ctx.strokeRect(draggedPiece.drawX, draggedPiece.drawY, pieceWidth, pieceHeight);
                ctx.globalAlpha = 1.0;
            }
        }

        function getPieceAtCoordinates(x, y) {
            const col = Math.floor(x / pieceWidth);
            const row = Math.floor(y / pieceHeight);
            return puzzlePieces.find(p => p.currentRow === row && p.currentCol === col);
        }

        function checkSolved() {
            return puzzlePieces.every(p => p.originalRow === p.currentRow && p.originalCol === p.currentCol);
        }

        function getCanvasPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        function handleStart(e) {
            e.preventDefault();
            const pos = getCanvasPos(e);
            draggedPiece = getPieceAtCoordinates(pos.x, pos.y);
            if (draggedPiece) {
                isDragging = true;
                offsetX = pos.x - (draggedPiece.currentCol * pieceWidth);
                offsetY = pos.y - (draggedPiece.currentRow * pieceHeight);
                draggedPiece.drawX = pos.x - offsetX;
                draggedPiece.drawY = pos.y - offsetY;
            }
        }

        function handleMove(e) {
            if (!isDragging || !draggedPiece) return;
            e.preventDefault();
            const pos = getCanvasPos(e);
            draggedPiece.drawX = pos.x - offsetX;
            draggedPiece.drawY = pos.y - offsetY;
            drawPuzzle();
        }

        function handleEnd(e) {
            if (!isDragging || !draggedPiece) return;
            e.preventDefault();
            isDragging = false;

            const pos = getCanvasPos(e.changedTouches ? e.changedTouches[0] : e);
            const dropCol = Math.floor(pos.x / pieceWidth);
            const dropRow = Math.floor(pos.y / pieceHeight);

            if (dropCol >= 0 && dropCol < COLS && dropRow >= 0 && dropRow < ROWS) {
                const targetPiece = puzzlePieces.find(p => p.currentRow === dropRow && p.currentCol === dropCol);
                if (targetPiece) {
                    [draggedPiece.currentRow, targetPiece.currentRow] = [targetPiece.currentRow, draggedPiece.currentRow];
                    [draggedPiece.currentCol, targetPiece.currentCol] = [targetPiece.currentCol, draggedPiece.currentCol];
                }
            }
            
            draggedPiece = null;
            drawPuzzle();

            if (checkSolved()) {
                showMessage('You solved it! ♡');
            }
        }
        
        puzzleImage.onload = () => {
            ctx.strokeStyle = '#FF69B4';
            resizeCanvas();
            initializeAndShuffle();
            
            if (shuffleButton) shuffleButton.addEventListener('click', initializeAndShuffle);
            if (messageCloseButton) messageCloseButton.addEventListener('click', hideMessage);

            canvas.addEventListener('mousedown', handleStart);
            canvas.addEventListener('mousemove', handleMove);
            canvas.addEventListener('mouseup', handleEnd);
            canvas.addEventListener('mouseleave', handleEnd);

            canvas.addEventListener('touchstart', handleStart, { passive: false });
            canvas.addEventListener('touchmove', handleMove, { passive: false });
            canvas.addEventListener('touchend', handleEnd);
            canvas.addEventListener('touchcancel', handleEnd);

            window.addEventListener('resize', resizeCanvas);
        };

        puzzleImage.onerror = () => {
            ctx.fillStyle = '#FFC0CB';
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = "20px VT323";
            ctx.textAlign = "center";
            ctx.fillText("Oops! Image couldn't load.", canvas.width/2, canvas.height/2);
        };

        puzzleImage.src = PUZZLE_IMAGE_URL;
    }
});