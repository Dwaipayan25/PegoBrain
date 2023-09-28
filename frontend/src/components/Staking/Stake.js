import React, { useState } from 'react';
import { ethers } from "ethers";
import './Stake.css';

function StakeComponent({ state }) {
    const [status, setStatus] = useState("");

    const handleStake = async () => {
        try {
            setStatus("Sending transaction...");
            const tx = await state.contract.stake({ value: ethers.utils.parseEther("1.0") });
            await tx.wait();
            setStatus("Staked 1 ETH successfully!");
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    const handleUnstake = async () => {
        try {
            setStatus("Sending transaction...");
            const tx = await state.contract.unstake();
            await tx.wait();
            setStatus("Unstaked 1 ETH successfully!");
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className='stake'>
        <div className="stake-container">
            <button onClick={handleStake}>Stake 1 ETH</button>
            <button onClick={handleUnstake}>Unstake</button>
            <div className="status">{status}</div>
        </div>
        <div className="disclaimer">
            <strong>Disclaimer:</strong>
            <p>1. You must stake 1PG to participate in reviewing research papers.</p>
            <p>2. When a research paper reviewed by you receives funding, you will earn rewards.</p>
            <p>3. 10% of the total funds is distributed among all the researchers.</p>
            <p>4. Ensure you understand the terms before staking your tokens.</p>
        </div>

        </div>
        
    );
}

export default StakeComponent;
