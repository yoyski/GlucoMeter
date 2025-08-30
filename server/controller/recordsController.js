import Records from "../model/records.model.js";

export const addRecord = async (req, res) => {
  const { date, result } = req.body;

  try {
    const record = new Records({
      date,
      result,
    });

    const savedRecord = await record.save();

    res.json(savedRecord);
  } catch (err) {
    res.status(500).json({
      message: `Error message from addRecordsController: ${err.message}`,
    });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const records = await Records.find();

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({
      message: `error message from getAllRecords ${err}`,
    });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Records.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        message: "Record not Found",
      });
    }

    return res.status(200).json({
      message: "Record deleted successfully",
      deletedRecord, // send back deleted doc
    });
  } catch (err) {
    res.status(500).json({
      message: `error message from deleteRecordsController ${err.message}`,
    });
  }
};