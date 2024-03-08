import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';

import CanvasConext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from './characterConstants';
import { TILE_SIZE } from './mapConstants';
import { loadCharacter } from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { update as updateAllCharactersData } from './slices/allCharactersSlice'


function MyCharacter({ myCharactersData, loadCharacter, updateAllCharactersData, webrtcSocket }) {
    const context = useContext(CanvasConext);
    useEffect(() => {
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };

        const users = {};
        const myId = MY_CHARACTER_INIT_CONFIG.id;
        users[myId] = myInitData;
        updateAllCharactersData(users);
    }, [webrtcSocket]);

    useEffect(() => {
        if (context == null || myCharactersData == null) {
            return;
        }

        const handleKeyPress = (event) => {
            const { keyCode } = event;
            const { position } = myCharactersData;

            let newX = position.x;
            let newY = position.y;

            // Update character's position based on key pressed
            switch (keyCode) {
                case 65: // A key
                case 37: // Left arrow key
                    newX -= 1;
                    break;
                case 87: // W key
                case 38: // Up arrow key
                    newY -= 1;
                    break;
                case 68: // D key
                case 39: // Right arrow key
                    newX += 1;
                    break;
                case 83: // S key
                case 40: // Down arrow key
                    newY += 1;
                    break;
                default:
                    break;
            }

            event.preventDefault();

            updateAllCharactersData({
                [MY_CHARACTER_INIT_CONFIG.id]: {
                    ...myCharactersData,
                    position: { x: newX, y: newY },
                },
            });
        };

        document.addEventListener('keydown', handleKeyPress);

        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [context, myCharactersData, updateAllCharactersData]);

    useEffect(() => {
        if (context == null || myCharactersData == null) {
            return;
        }

        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            myCharactersData.position.x * TILE_SIZE,
            myCharactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, myCharactersData?.position.x, myCharactersData?.position.y, loadCharacter]);

    return null;
}

const mapStateToProps = (state) => {
    return { myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id] };
};

const mapDispatch = { loadCharacter, updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);
