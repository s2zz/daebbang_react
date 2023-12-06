// OneRoom.js

import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Map from './Map/Map';
import Item from './Item/Item';

function OneRoom() {
  return (
    <div>
      <table>
        <tr>
            <td>
            <Link to="/oneroom/map">맵</Link>
            </td>
            <td>
            <Link to="/oneroom/item">아이템</Link>
            </td>
        </tr>
      </table>
    </div>
  );
}

export default OneRoom;