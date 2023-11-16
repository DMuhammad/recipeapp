import { useState, useEffect } from "react";
import { RecipeSummary } from "../types";
import { getRecipeSummary } from "../API";

interface Props {
    recipeId: string;
    onClose: () => void;
}

const RecipeModal = ({recipeId, onClose} : Props) => {
    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>()

    useEffect(() => {
        const fetchRecipeSummary = async () => {
            try {
                const summary = await getRecipeSummary(recipeId)
                setRecipeSummary(summary)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRecipeSummary()
    }, [recipeId])

    if (!recipeSummary) {
        return <></>
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{recipeSummary.title}</h2>
                        <span className="close-button" onClick={onClose}>&times;</span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}} />
                </div>
            </div>
        </div>
    )
}

export default RecipeModal