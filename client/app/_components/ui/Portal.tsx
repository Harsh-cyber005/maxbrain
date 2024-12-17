"use client";
import React from 'react'
import Modal from './Modal'
import { useAppContext } from '@/app/context/AppContext';

function Portal() {
    const {modalComponent} = useAppContext();
    return (
        <div>
            <Modal>
                {modalComponent}
            </Modal>
        </div>
    )
}

export default Portal