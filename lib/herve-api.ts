type TaskStatus = "PENDING" | "RUNNING" | "QUEUED" | "SUCCESS" | "FAILED" | "";

export const API_KEY = "23b1478707ce4a00911b904d62dbb503";

export async function fetchTaskOutput(taskId: string): Promise<string | null> {
  try {
    const res = await fetch("https://www.runninghub.ai/task/openapi/outputs", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Host": "www.runninghub.ai" },
      body: JSON.stringify({ apiKey: API_KEY, taskId }),
    });
    const data = await res.json();
    return data.code === 0 && data.data?.[0]?.fileUrl ? data.data[0].fileUrl : null;
  } catch (err) {
    console.error("Error fetching task output:", err);
    return null;
  }
}

// Poll task status with optional UI updates
// pollTaskStatus removed for pose generation; remaining functions use their own polling internally

// Run a generic task
// runTask removed - pose generation is not used anymore; use pregenerated poses from S3

// Final processing (for clothing generator)
export async function startFinalProcessing(
  modelImage: string,
  clothingImage: string,
  region: string,
  setTaskStatus?: (status: TaskStatus) => void,
  setOutputImage?: (url: string) => void,
  setShowLoading?: (loading: boolean) => void
): Promise<string | null> {
  try {
    setTaskStatus?.("RUNNING");
    setShowLoading?.(true);

    const body = {
      webappId: "1963659857947758593",
      apiKey: API_KEY,
      nodeInfoList: [
        { nodeId: "178", fieldName: "image", fieldValue: modelImage, description: "Model Image" },
        { nodeId: "542", fieldName: "image", fieldValue: clothingImage, description: "Garment Image" },
        { nodeId: "714", fieldName: "text", fieldValue: region, description: "Region of Interest" },
      ],
    };

    const res = await fetch("https://www.runninghub.ai/task/openapi/ai-app/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Host": "www.runninghub.ai" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.code === 0 && data.data?.taskId) {
      const taskId = data.data.taskId;
      // inline polling
      let status: TaskStatus = "RUNNING";
      while (status === "RUNNING" || status === "QUEUED") {
        const sres = await fetch("https://www.runninghub.ai/task/openapi/status", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Host": "www.runninghub.ai" },
          body: JSON.stringify({ apiKey: API_KEY, taskId }),
        });
        const sdata = await sres.json();
        if (sdata.code === 0) {
          status = sdata.data as TaskStatus;
          setTaskStatus?.(status);
          if (status === "FAILED" || status === "SUCCESS") break;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (status === "SUCCESS") {
        const url = await fetchTaskOutput(taskId);
        if (url) setOutputImage?.(url);
      } else {
        setTaskStatus?.("FAILED");
      }
      return taskId;
    }
    setTaskStatus?.("FAILED");
    return null;
  } catch (err) {
    console.error("Error starting final processing:", err);
    setTaskStatus?.("FAILED");
    return null;
  } finally {
    setShowLoading?.(false);
  }
}

// Realistic processing
export async function startRealisticProcessing(
  inputImage: string,
  setTaskStatus?: (status: TaskStatus) => void,
  setOutputImage?: (url: string) => void,
  setShowLoading?: (loading: boolean) => void
): Promise<string | null> {
  try {
    setTaskStatus?.("RUNNING");
    setShowLoading?.(true);

    const body = {
      webappId: "1963826374476910593",
      apiKey: API_KEY,
      nodeInfoList: [{ nodeId: "120", fieldName: "image", fieldValue: inputImage, description: "Input Image" }],
    };

    const res = await fetch("https://www.runninghub.ai/task/openapi/ai-app/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Host": "www.runninghub.ai" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.code === 0 && data.data?.taskId) {
      const taskId = data.data.taskId;
      // inline polling
      let status: TaskStatus = "RUNNING";
      while (status === "RUNNING" || status === "QUEUED") {
        const sres = await fetch("https://www.runninghub.ai/task/openapi/status", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Host": "www.runninghub.ai" },
          body: JSON.stringify({ apiKey: API_KEY, taskId }),
        });
        const sdata = await sres.json();
        if (sdata.code === 0) {
          status = sdata.data as TaskStatus;
          setTaskStatus?.(status);
          if (status === "FAILED" || status === "SUCCESS") break;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (status === "SUCCESS") {
        const url = await fetchTaskOutput(taskId);
        if (url) setOutputImage?.(url);
      } else {
        setTaskStatus?.("FAILED");
      }
      return taskId;
    }
    setTaskStatus?.("FAILED");
    return null;
  } catch (err) {
    console.error("Error starting realistic processing:", err);
    setTaskStatus?.("FAILED");
    return null;
  } finally {
    setShowLoading?.(false);
  }
}
