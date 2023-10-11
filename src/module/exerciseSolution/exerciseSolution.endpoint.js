import {roles} from '../../middleware/auth.js';
export const endpoints ={
    createSolution:[roles.user],
    updateSolution:[roles.user],
    deleteSolution:[roles.user],
    getSolutions:[roles.admin],
    getSpecificSolution:[roles.admin,roles.user],
    markSolution:[roles.admin],
    updateMarkSolution:[roles.admin]
}