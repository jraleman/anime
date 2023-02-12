import React from 'react';

export type Props = {
    data?: any;
}

function AnimeCard({ data }: Props) {
    return (
        <div className="card">
            {JSON.stringify(data?.data[0])}
        </div>
    );
}

export default AnimeCard;
