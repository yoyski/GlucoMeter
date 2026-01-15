import Router from "express"

import { addRecord, getAllRecords, deleteRecord } from "../controller/recordsController.js";

const router = Router()

router.route('/').post(addRecord);
router.route('/').get(getAllRecords);
router.route('/:id').delete(deleteRecord)

export default router;