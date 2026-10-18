function Card({

    children,

    className=""

}){

    return(

        <div

            className={`
                border
                border-border
                bg-surface
                shadow-neo

                ${className}
            `}

        >

            {children}

        </div>

    )

}

export default Card;