import { useState, useEffect, useRef, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Download,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Award,
  ShieldCheck,
  ChevronRight,
  Eye,
  X,
  UserCheck,
  Lock,
  Mail,
} from "lucide-react";
import { PARTICIPANTS } from "../data/participants";
import { Button } from "../components/ui";

// Event metadata configuration
const EVENT_CONFIG = {
  dataheist: {
    id: "dataheist",
    displayName: "DATA HEIST",
    tagline: "CTF × Machine Learning Challenge",
    template: "/certificates/dataheist.png",
  },
  dreamforge: {
    id: "dreamforge",
    displayName: "DREAMFORGE",
    tagline: "Case Study & Innovation Challenge",
    template: "/certificates/dreamforge.png",
  },
  tinkercase: {
    id: "tinkercase",
    displayName: "TINKERCASE",
    tagline: "Hardware Showcase & Core Electronics",
    template: "/certificates/tinkercase.png",
  },
};

// Exact byte sizes of the reference sample images to prevent submitting the sample images directly
const REFERENCE_SAMPLE_SIZES = {
  confirmation: 83794, // public/certificates/completed_task.jpeg
  dashboard: 61017, // public/certificates/dashboard.jpeg
};

/**
 * Normalizes event string from data to known event keys
 */
function normalizeEventKey(evt) {
  if (!evt) return "dataheist";
  const clean = evt.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.includes("data")) return "dataheist";
  if (clean.includes("dream")) return "dreamforge";
  if (clean.includes("tinker")) return "tinkercase";
  return EVENT_CONFIG[clean] ? clean : "dataheist";
}

/**
 * Check if the uploaded file is identical to the demo sample images
 */
function isReferenceSampleFile(file, type) {
  if (!file) return false;
  if (type === "confirmation" && file.size === REFERENCE_SAMPLE_SIZES.confirmation) {
    return true;
  }
  if (type === "dashboard" && file.size === REFERENCE_SAMPLE_SIZES.dashboard) {
    return true;
  }
  const cleanName = (file.name || "").toLowerCase();
  if (
    cleanName.includes("completed_task") ||
    cleanName.includes("completed-task") ||
    cleanName === "dashboard.jpeg" ||
    cleanName === "dashboard.jpg"
  ) {
    if (
      file.size === REFERENCE_SAMPLE_SIZES.confirmation ||
      file.size === REFERENCE_SAMPLE_SIZES.dashboard
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether two uploaded files are identical
 */
function areFilesIdentical(file1, file2) {
  if (!file1 || !file2) return false;
  return (
    file1.size === file2.size &&
    file1.name === file2.name &&
    file1.lastModified === file2.lastModified
  );
}

/**
 * Image similarity check function for Proof 1 (Confirmation Screen)
 * 1. Loads both images onto hidden canvases
 * 2. Computes Normalized Cross-Correlation (NCC) at 32x32
 * 3. Computes 24-bin color histogram cosine similarity
 * 4. Returns similarity score (0-100) and verified flag
 */
async function checkImageSimilarity(uploadedFile, referenceUrl) {
  if (isReferenceSampleFile(uploadedFile, "confirmation")) {
    return {
      score: 0,
      verified: false,
      reason:
        "The demo sample preview image cannot be submitted as proof. Please upload your own original screenshot from your phone or browser.",
    };
  }

  const uploadedUrl = URL.createObjectURL(uploadedFile);

  const loadImage = (src, isCrossorigin = false) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (isCrossorigin) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
      img.src = src;
    });
  };

  try {
    const [imgUploaded, imgRef] = await Promise.all([
      loadImage(uploadedUrl, false),
      loadImage(referenceUrl, true),
    ]);

    // 1. Structural Comparison at 32x32
    const sSize = 32;
    const sCanvas1 = document.createElement("canvas");
    sCanvas1.width = sSize;
    sCanvas1.height = sSize;
    const sCtx1 = sCanvas1.getContext("2d", { willReadFrequently: true });
    sCtx1.drawImage(imgUploaded, 0, 0, sSize, sSize);

    const sCanvas2 = document.createElement("canvas");
    sCanvas2.width = sSize;
    sCanvas2.height = sSize;
    const sCtx2 = sCanvas2.getContext("2d", { willReadFrequently: true });
    sCtx2.drawImage(imgRef, 0, 0, sSize, sSize);

    const sData1 = sCtx1.getImageData(0, 0, sSize, sSize).data;
    const sData2 = sCtx2.getImageData(0, 0, sSize, sSize).data;

    // Calculate Normalized Cross-Correlation (NCC) across pixels
    let mean1 = 0;
    let mean2 = 0;
    const count = sSize * sSize * 3;
    for (let i = 0; i < sData1.length; i += 4) {
      mean1 += sData1[i] + sData1[i + 1] + sData1[i + 2];
      mean2 += sData2[i] + sData2[i + 1] + sData2[i + 2];
    }
    mean1 /= count;
    mean2 /= count;

    let num = 0;
    let den1 = 0;
    let den2 = 0;
    for (let i = 0; i < sData1.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const v1 = sData1[i + c] - mean1;
        const v2 = sData2[i + c] - mean2;
        num += v1 * v2;
        den1 += v1 * v1;
        den2 += v2 * v2;
      }
    }
    const ncc = den1 > 0 && den2 > 0 ? num / Math.sqrt(den1 * den2) : 0;
    const nccScore = Math.max(0, Math.min(100, Math.round(ncc * 100)));

    // 2. Color Histogram Comparison (8 bins per channel)
    const computeHistogram = (pixelData) => {
      const hist = new Float64Array(24);
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] < 10) continue;
        const rBin = Math.min(7, Math.floor(pixelData[i] / 32));
        const gBin = Math.min(7, Math.floor(pixelData[i + 1] / 32));
        const bBin = Math.min(7, Math.floor(pixelData[i + 2] / 32));
        hist[rBin]++;
        hist[8 + gBin]++;
        hist[16 + bBin]++;
      }
      return hist;
    };

    const hist1 = computeHistogram(sData1);
    const hist2 = computeHistogram(sData2);

    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < 24; i++) {
      dot += hist1[i] * hist2[i];
      norm1 += hist1[i] * hist1[i];
      norm2 += hist2[i] * hist2[i];
    }
    const colorCosine =
      norm1 > 0 && norm2 > 0 ? dot / (Math.sqrt(norm1) * Math.sqrt(norm2)) : 0;
    const colorScore = Math.max(0, Math.min(100, Math.round(colorCosine * 100)));

    // Composite Score: 60% structural NCC + 40% color profile match
    const compositeScore = Math.round(0.6 * nccScore + 0.4 * colorScore);
    const verified = compositeScore >= 40 || (nccScore >= 35 && colorScore >= 50);

    return {
      score: compositeScore,
      verified,
      reason: verified
        ? "Confirmation screenshot successfully verified."
        : "Image match score too low. Please upload the 'Welcome to the heap' screen.",
    };
  } finally {
    URL.revokeObjectURL(uploadedUrl);
  }
}

/**
 * Preprocesses an image onto an in-memory canvas constrained to maxDimension.
 * Reduces memory usage and keeps Tesseract OCR processing under 1-2 seconds.
 */
function preprocessImageForOcr(file, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      let targetWidth = width;
      let targetHeight = height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          targetWidth = maxDimension;
          targetHeight = Math.round((height * maxDimension) / width);
        } else {
          targetHeight = maxDimension;
          targetWidth = Math.round((width * maxDimension) / height);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for OCR preprocessing."));
    };
    img.src = url;
  });
}

/**
 * Robust email matching in OCR extracted text:
 * - Checks exact email
 * - Checks truncated email with mobile ellipsis (e.g. zahansharma123@gmail.c... or zahansharma123@...)
 * - Detects mismatched email if another user's email was uploaded
 * - Fallback to username substring match
 */
function matchEmailInText(expectedEmail, ocrText) {
  if (!expectedEmail || !ocrText) {
    return { matched: false, reason: "No email or OCR text provided." };
  }

  const cleanExpected = expectedEmail.trim().toLowerCase();
  const [expectedUser] = cleanExpected.split("@");
  const normalizedOcr = ocrText.toLowerCase().replace(/[\r\n]+/g, " ");

  // 1. Direct match of full email
  if (normalizedOcr.includes(cleanExpected)) {
    return {
      matched: true,
      confidence: 100,
      detected: cleanExpected,
      details: "Full registered email found in screenshot.",
    };
  }

  // 2. Truncated match with ellipsis or partial domain
  // e.g. "zahansharma123@gmail.c..." or "zahansharma123@g..." or "zahansharma123@..."
  const escapedUser = expectedUser.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const userRegex = new RegExp(
    `${escapedUser}[\\s]*[@©oO0]?[\\s]*[a-z0-9.]*`,
    "i",
  );
  const userMatch = normalizedOcr.match(userRegex);

  if (userMatch && userMatch[0].length >= Math.min(expectedUser.length, 4)) {
    return {
      matched: true,
      confidence: 90,
      detected: userMatch[0].trim(),
      details: "Account username verified in dashboard.",
    };
  }

  // 3. Check for any detected emails to check if a DIFFERENT participant's email is present
  const emailRegex =
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.\.\.)/g;
  const detectedEmails = normalizedOcr.match(emailRegex) || [];

  if (detectedEmails.length > 0) {
    const firstDetected = detectedEmails[0];
    return {
      matched: false,
      detectedMismatch: firstDetected,
      reason: `Email mismatch: Screenshot displays "${firstDetected}", which does not match your registered email "${cleanExpected}". Screenshots cannot be shared.`,
    };
  }

  // 4. Fallback check: username substring match if username has sufficient length
  if (expectedUser.length >= 5 && normalizedOcr.includes(expectedUser)) {
    return {
      matched: true,
      confidence: 85,
      detected: expectedUser,
      details: "Account username recognized in screenshot.",
    };
  }

  return {
    matched: false,
    reason: `Could not detect "${cleanExpected}" in this screenshot. Please ensure your Account Profile screen clearly displays your registered email.`,
  };
}

/**
 * Secondary Check: Analyze Account Dashboard Screenshot via Tesseract.js OCR
 */
async function analyzeDashboardOcr(
  uploadedFile,
  expectedEmail,
  proof1File,
  onProgress,
) {
  // Check if participant uploaded the sample preview image directly
  if (isReferenceSampleFile(uploadedFile, "dashboard")) {
    return {
      verified: false,
      reason:
        "The demo sample preview image cannot be submitted as proof. Please upload your own original screenshot from your phone or browser.",
    };
  }

  // Check if participant uploaded the exact same file as Proof 1
  if (proof1File && areFilesIdentical(uploadedFile, proof1File)) {
    return {
      verified: false,
      reason:
        "Proof 1 and Proof 2 must be different screenshots (Proof 1: Confirmation Screen, Proof 2: Account Profile Screen).",
    };
  }

  onProgress?.({
    status: "preprocessing",
    progress: 10,
    message: "Optimizing image for neural OCR...",
  });

  const canvas = await preprocessImageForOcr(uploadedFile, 1200);

  onProgress?.({
    status: "initializing",
    progress: 25,
    message: "Initializing Tesseract neural model...",
  });

  const worker = await createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        const pct = Math.round(35 + (m.progress || 0) * 55);
        onProgress?.({
          status: "recognizing",
          progress: pct,
          message: `Reading text from screenshot (${Math.round((m.progress || 0) * 100)}%)...`,
        });
      }
    },
  });

  try {
    onProgress?.({
      status: "scanning",
      progress: 50,
      message: "Scanning document contents...",
    });

    const ret = await worker.recognize(canvas);
    const text = ret.data.text || "";

    onProgress?.({
      status: "evaluating",
      progress: 95,
      message: "Verifying account credentials & layout...",
    });

    // Check for dashboard profile keywords
    const lowerText = text.toLowerCase();
    const dashboardKeywords = [
      "account profile",
      "account",
      "profile",
      "subscription",
      "personal details",
      "email",
      "plan",
      "free plan",
      "heap",
      "heapheaphurray",
      "refer a friend",
      "unsubscribe",
    ];

    const matchedKeywords = dashboardKeywords.filter((kw) =>
      lowerText.includes(kw),
    );
    const isDashboardLayout = matchedKeywords.length >= 2;

    // Verify email match
    const emailMatch = matchEmailInText(expectedEmail, text);

    if (!isDashboardLayout && !emailMatch.matched) {
      return {
        verified: false,
        text,
        matchedKeywords,
        reason:
          "Could not identify the Heap Heap Hurray Account Profile screen. Please ensure you screenshot the page showing 'Account profile' and your email.",
      };
    }

    if (!emailMatch.matched) {
      return {
        verified: false,
        text,
        matchedKeywords,
        reason: emailMatch.reason,
      };
    }

    return {
      verified: true,
      text,
      matchedKeywords,
      emailMatch,
      detectedEmail: emailMatch.detected,
      confidence: emailMatch.confidence,
      reason: "Account profile and email ownership verified successfully!",
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * Certificate generator function using Canvas API
 */
async function generateCertificateCanvas(
  templateUrl,
  participantName,
  fontType = "Montserrat",
) {
  if (document.fonts) {
    try {
      await Promise.allSettled([
        document.fonts.load("bold 70px 'Montserrat'"),
        document.fonts.load("700 85px 'Caveat'"),
      ]);
      await document.fonts.ready;
    } catch {
      // Proceed if font readiness API is unavailable
    }
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = templateUrl;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () =>
      reject(new Error(`Failed to load certificate template: ${templateUrl}`));
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width || 2000;
  canvas.height = img.naturalHeight || img.height || 1414;
  const ctx = canvas.getContext("2d");

  // Draw base template
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Position: centered horizontally (x = 1000), right above the underline at y=794..799
  const x = canvas.width / 2;
  const y = canvas.height * (782 / 1414);

  // Font size calculation: scale based on name length
  const nameLen = participantName.trim().length;
  const scaleRatio = canvas.width / 2000;
  const isScript = fontType === "Caveat";
  const baseSize = isScript
    ? Math.max(50, 92 - Math.max(0, nameLen - 12) * 1.6)
    : Math.max(42, 70 - Math.max(0, nameLen - 12) * 1.4);
  let fontSize = Math.round(baseSize * scaleRatio);

  const fontFamily = isScript ? "'Caveat', cursive" : "'Montserrat', sans-serif";
  ctx.font = `${isScript ? "700" : "bold"} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "#1f2120";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  // Safeguard against overflow on exceptionally long names
  const maxAllowedWidth = canvas.width * 0.65;
  const measuredWidth = ctx.measureText(participantName).width;
  if (measuredWidth > maxAllowedWidth && measuredWidth > 0) {
    fontSize = Math.floor(fontSize * (maxAllowedWidth / measuredWidth));
    ctx.font = `${isScript ? "700" : "bold"} ${fontSize}px ${fontFamily}`;
  }

  // Draw name overlay
  ctx.fillText(participantName, x, y);

  return canvas;
}

export function CertificateClaim() {
  // Stepper state: 1: Verify, 2: Task, 3: Proof, 4: Certificate
  const [step, setStep] = useState(1);

  // Step 1: Email verification
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [participant, setParticipant] = useState(null);
  const [allMatchedEvents, setAllMatchedEvents] = useState([]);
  const [selectedEventKey, setSelectedEventKey] = useState("dataheist");

  // Step 3: Proof 1 (Primary Check: Subscription Confirmation)
  const [proof1File, setProof1File] = useState(null);
  const [proof1Preview, setProof1Preview] = useState(null);
  const [proof1Analyzing, setProof1Analyzing] = useState(false);
  const [proof1Result, setProof1Result] = useState(null);
  const [proof1Error, setProof1Error] = useState("");
  const [proof1DragOver, setProof1DragOver] = useState(false);
  const proof1InputRef = useRef(null);

  // Step 3: Proof 2 (Secondary Check: Account Dashboard with Email)
  const [proof2File, setProof2File] = useState(null);
  const [proof2Preview, setProof2Preview] = useState(null);
  const [proof2Analyzing, setProof2Analyzing] = useState(false);
  const [proof2Progress, setProof2Progress] = useState(null);
  const [proof2Result, setProof2Result] = useState(null);
  const [proof2Error, setProof2Error] = useState("");
  const [proof2DragOver, setProof2DragOver] = useState(false);
  const proof2InputRef = useRef(null);

  // Reference modal state
  const [showRefModal, setShowRefModal] = useState(false);
  const [refModalTab, setRefModalTab] = useState("confirmation"); // "confirmation" | "dashboard"

  // Step 4: Certificate Generation & Download
  const [certDataUrl, setCertDataUrl] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [fontChoice, setFontChoice] = useState("Montserrat");
  const canvasRef = useRef(null);

  // Step 1: Submit email handler
  const handleVerifyEmail = (e) => {
    e?.preventDefault();
    setEmailError("");

    const query = emailInput.trim().toLowerCase();
    if (!query) {
      setEmailError("Please enter your registered email address.");
      return;
    }

    const matches = PARTICIPANTS.filter(
      (p) => p.email && p.email.trim().toLowerCase() === query,
    );

    if (matches.length === 0) {
      setEmailError(
        "No registration record found for this email. Please check for typos or ensure you registered for IEEE Day 2026.",
      );
      return;
    }

    const primaryParticipant = matches[0];
    const initialEventKey = normalizeEventKey(primaryParticipant.event);

    setParticipant(primaryParticipant);
    setAllMatchedEvents(matches);
    setSelectedEventKey(initialEventKey);
    setStep(2);
  };

  // Step 3: Process Proof 1 (Subscription Confirmation)
  const handleProof1Selected = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProof1Error("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }

    setProof1Error("");
    setProof1File(file);
    const objUrl = URL.createObjectURL(file);
    setProof1Preview(objUrl);
    setProof1Analyzing(true);
    setProof1Result(null);

    try {
      const result = await checkImageSimilarity(
        file,
        "/certificates/completed_task.jpeg",
      );
      setProof1Result(result);
      if (!result.verified && result.reason) {
        setProof1Error(result.reason);
      }
    } catch (err) {
      console.error(err);
      setProof1Error(
        "Error analyzing confirmation screenshot. Please try uploading again.",
      );
    } finally {
      setProof1Analyzing(false);
    }
  }, []);

  // Step 3: Process Proof 2 (Secondary Check - Account Dashboard with Email)
  const handleProof2Selected = useCallback(
    async (file) => {
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setProof2Error("Please upload an image file (PNG, JPG, or WEBP).");
        return;
      }

      setProof2Error("");
      setProof2File(file);
      const objUrl = URL.createObjectURL(file);
      setProof2Preview(objUrl);
      setProof2Analyzing(true);
      setProof2Progress({ status: "start", progress: 5, message: "Reading file..." });
      setProof2Result(null);

      try {
        const expectedEmail = participant?.email || "";
        const result = await analyzeDashboardOcr(
          file,
          expectedEmail,
          proof1File,
          (progressInfo) => {
            setProof2Progress(progressInfo);
          },
        );
        setProof2Result(result);
        if (!result.verified && result.reason) {
          setProof2Error(result.reason);
        }
      } catch (err) {
        console.error(err);
        setProof2Error(
          "Error executing OCR analysis on dashboard screenshot. Please try again.",
        );
      } finally {
        setProof2Analyzing(false);
        setProof2Progress(null);
      }
    },
    [participant, proof1File],
  );

  const resetProof1 = () => {
    setProof1File(null);
    if (proof1Preview) URL.revokeObjectURL(proof1Preview);
    setProof1Preview(null);
    setProof1Result(null);
    setProof1Error("");
    if (proof1InputRef.current) proof1InputRef.current.value = "";
  };

  const resetProof2 = () => {
    setProof2File(null);
    if (proof2Preview) URL.revokeObjectURL(proof2Preview);
    setProof2Preview(null);
    setProof2Result(null);
    setProof2Progress(null);
    setProof2Error("");
    if (proof2InputRef.current) proof2InputRef.current.value = "";
  };

  // Both proofs verified check
  const isBothProofsVerified =
    proof1Result?.verified === true && proof2Result?.verified === true;

  // Step 4: Generate Certificate on canvas whenever event or font changes
  useEffect(() => {
    if (step !== 4 || !participant) return;

    let cancelled = false;
    const currentConfig = EVENT_CONFIG[selectedEventKey] || EVENT_CONFIG.dataheist;

    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setIsGeneratingCert(true);
        return generateCertificateCanvas(
          currentConfig.template,
          participant.name,
          fontChoice,
        );
      })
      .then((canvas) => {
        if (cancelled || !canvas) return;
        canvasRef.current = canvas;
        const dataUrl = canvas.toDataURL("image/png");
        setCertDataUrl(dataUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Certificate generation error:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setIsGeneratingCert(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [step, participant, selectedEventKey, fontChoice]);

  // Download certificate action
  const handleDownload = () => {
    if (!canvasRef.current && !certDataUrl) return;

    const currentConfig = EVENT_CONFIG[selectedEventKey] || EVENT_CONFIG.dataheist;
    const safeEvent = currentConfig.displayName.replace(/\s+/g, "_");
    const safeName = (participant?.name || "Participant").replace(/\s+/g, "_");
    const filename = `IEEE_Day_2026_${safeEvent}_${safeName}.png`;

    const link = document.createElement("a");
    link.download = filename;
    link.href = certDataUrl || canvasRef.current.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stepper metadata
  const stepsMeta = [
    { num: 1, label: "Verify" },
    { num: 2, label: "Task" },
    { num: 3, label: "Proof" },
    { num: 4, label: "Certificate" },
  ];

  const currentEventInfo = EVENT_CONFIG[selectedEventKey] || EVENT_CONFIG.dataheist;

  return (
    <div className="min-h-screen bg-charcoal text-paper font-sans flex flex-col selection:bg-red selection:text-paper relative overflow-x-hidden">
      {/* Decorative racing checkerboard top strip */}
      <div
        className="h-2.5 w-full opacity-80"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #c51216 0, #c51216 12px, #1f2120 12px, #1f2120 24px)`,
        }}
      />

      {/* Atmospheric ambient top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(197,18,22,0.18),transparent)]"
      />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-pit/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container-page py-4 flex items-center justify-between">
          <a
            href="/"
            className="group inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-button text-paper/80 hover:text-paper transition-colors"
          >
            <div className="w-7 h-7 bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-red group-hover:bg-red/10 transition-colors">
              <ArrowLeft className="w-4 h-4 text-red transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>Return to Paddock</span>
          </a>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-steel">
            <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
            <span className="hidden sm:inline">PIT WALL // </span>
            <span>CREDENTIAL DESK</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container-page py-8 sm:py-12 flex flex-col items-center justify-start">
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="label-spaced text-red mb-2.5">
            IEEE DAY 2026 // OFFICIAL CREDENTIALS
          </div>
          <h1
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-wide uppercase text-paper"
          >
            Claim Your Certificate
          </h1>
          <p className="mt-3 text-steel text-sm sm:text-base leading-relaxed">
            Verify your registration, complete the sponsor task, and authenticate both proofs to instantly unlock your certificate.
          </p>
        </div>

        {/* Stepper Navigation */}
        <nav aria-label="Progress" className="w-full max-w-3xl mb-8 sm:mb-10">
          <ol className="relative flex items-center justify-between">
            {stepsMeta.map((s, idx) => {
              const isCompleted = step > s.num;
              const isActive = step === s.num;

              return (
                <li
                  key={s.num}
                  className={`flex flex-col items-center relative z-10 flex-1 ${
                    idx !== stepsMeta.length - 1 ? "pr-4 sm:pr-8" : ""
                  }`}
                >
                  <div className="flex items-center w-full">
                    <button
                      type="button"
                      disabled={s.num > step}
                      onClick={() => {
                        if (s.num < step) setStep(s.num);
                      }}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-none flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 border ${
                        isCompleted
                          ? "bg-red text-paper border-red cursor-pointer hover:bg-red-deep"
                          : isActive
                            ? "bg-pit text-paper border-2 border-red ring-4 ring-red/20"
                            : "bg-pit/80 text-steel border-white/15 cursor-not-allowed"
                      }`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-paper stroke-[2.5]" />
                      ) : (
                        <span>{s.num}</span>
                      )}
                    </button>

                    {/* Connecting Line */}
                    {idx < stepsMeta.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 ml-2 sm:ml-3 transition-colors duration-200 ${
                          step > s.num ? "bg-red" : "bg-white/15"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`hidden sm:block mt-2 text-[11px] font-semibold uppercase tracking-wider ${
                      isActive
                        ? "text-red font-bold"
                        : isCompleted
                          ? "text-paper"
                          : "text-steel/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Wizard Card Body */}
        <div className="w-full max-w-3xl">
          {/* STEP 1: Email Verification */}
          {step === 1 && (
            <div className="bg-pit border border-white/15 p-6 sm:p-9 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="label-spaced text-red block">STAGE 01</span>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-paper mt-0.5">
                    Email Verification
                  </h2>
                </div>
                <div className="text-right font-mono text-xs text-steel">
                  STATUS // AWAITING INPUT
                </div>
              </div>

              <p className="text-steel text-sm sm:text-base mb-6 leading-relaxed">
                Enter the email address you registered with on Unstop or during IEEE Day 2026.
              </p>

              <form onSubmit={handleVerifyEmail} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="label-spaced text-paper/90 block mb-2"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoFocus
                      required
                      placeholder="driver@example.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className="w-full bg-[#161817] border border-white/20 text-paper px-4 py-3.5 text-sm sm:text-base font-mono placeholder:text-steel/50 focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                    />
                  </div>

                  {emailError && (
                    <div className="mt-3 p-3 bg-red/10 border border-red/30 flex items-start gap-2.5 text-xs sm:text-sm text-red-bright leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center text-sm py-4 cursor-pointer"
                    trailing={<ChevronRight className="w-4 h-4" />}
                  >
                    Verify Email & Proceed
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Complete the Sponsor Task */}
          {step === 2 && (
            <div className="bg-pit border border-white/15 p-6 sm:p-9 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="label-spaced text-red block">STAGE 02</span>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-paper mt-0.5">
                    Complete the Sponsor Task
                  </h2>
                </div>
                {participant && (
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-steel block">
                      VERIFIED PARTICIPANT
                    </span>
                    <span className="text-xs font-bold text-paper">
                      {participant.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Multi-event selection banner if registered for multiple */}
              {allMatchedEvents.length > 1 && (
                <div className="mb-6 p-4 bg-white/5 border border-white/15">
                  <div className="label-spaced text-xs text-steel mb-2">
                    SELECT CERTIFICATE TO CLAIM ({allMatchedEvents.length} EVENTS FOUND)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {allMatchedEvents.map((item) => {
                      const key = normalizeEventKey(item.event);
                      const isSelected = selectedEventKey === key;
                      const cfg = EVENT_CONFIG[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedEventKey(key)}
                          className={`p-2.5 text-left border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red text-paper border-red"
                              : "bg-pit text-paper/80 border-white/15 hover:border-white/30"
                          }`}
                        >
                          <div className="text-xs font-bold font-mono">
                            {cfg.displayName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sponsor Mission Details */}
              <div className="space-y-4 mb-8 bg-[#161817] border border-white/10 p-5 sm:p-6 text-paper/90 text-sm sm:text-base leading-relaxed">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-mono text-red">
                  <ShieldCheck className="w-4 h-4 text-red" />
                  <span>OFFICIAL SPONSOR MISSION // HEAP HEAP HURRAY</span>
                </div>

                <p className="font-semibold text-paper text-base sm:text-lg italic">
                  &ldquo;Our algorithm knows what keeps you scrolling. This finds the tech actually worth knowing.&rdquo;
                </p>

                <p className="text-steel">
                  Most tech newsletters are written for San Francisco. This one&apos;s written for India.
                </p>

                <p className="text-steel">
                  Tech gossip. Latest news. Useful tools. Trending repos. Obscure change logs. One free email, every weekday morning. Already read on 50+ Indian campuses.
                </p>

                {/* Clear 4-Step Instructions */}
                <div className="pt-4 border-t border-white/10">
                  <div className="label-spaced text-xs text-paper mb-3">
                    STEPS TO COMPLETE & VERIFY:
                  </div>
                  <ol className="space-y-2 text-xs sm:text-sm text-steel font-mono">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Click the link or scan the QR code below to open Heap Heap Hurray.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Enter your registered email (
                        <strong className="text-paper">{participant?.email}</strong>
                        ) and complete signup.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Confirm your email in your inbox, then take <strong>Screenshot 1</strong> of the &quot;You&apos;re in. Welcome to the heap&quot; screen.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        Open your <strong>Account Profile / Dashboard</strong> and take <strong>Screenshot 2</strong> showing your email.
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Anti-Fraud Secondary Check Info Notice */}
                <div className="mt-4 p-3 bg-red/10 border border-red/30 flex items-start gap-2.5 text-xs text-red-bright leading-relaxed">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="uppercase font-mono">Secondary Verification Check:</strong>
                    <span className="text-steel block mt-0.5">
                      To prevent screenshot sharing and ensure fairness, our OCR engine extracts and checks the email on your dashboard screenshot against your IEEE Day registration.
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code and Direct Link */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 mb-8">
                <div className="bg-paper p-3 shadow-md shrink-0 border border-white/20">
                  <QRCodeSVG
                    value="https://dub.sh/2tg4bBO"
                    size={140}
                    bgColor="#f8f8f4"
                    fgColor="#161817"
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="label-spaced text-xs text-red">
                    FAST TRACK // DIRECT LINK
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-paper">
                    Sign up on Heap Heap Hurray
                  </h3>
                  <p className="text-xs sm:text-sm text-steel leading-relaxed">
                    Open the link directly in your browser or scan with your phone camera. Take both screenshots to pass verification in the next step.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href="https://dub.sh/2tg4bBO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper text-charcoal hover:bg-white text-xs font-semibold uppercase tracking-button transition-colors"
                    >
                      <span>Open Newsletter Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowRefModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-paper text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-red" />
                      <span>View Sample Screens</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-3 border border-white/20 text-paper/80 hover:text-paper hover:border-white text-xs font-semibold uppercase tracking-button transition-colors cursor-pointer"
                >
                  ← Back to Email
                </button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto justify-center text-xs py-3.5 cursor-pointer"
                  trailing={<ChevronRight className="w-4 h-4" />}
                >
                  I&apos;ve completed the task & captured screenshots
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Proofs & Secondary Anti-Fraud Check */}
          {step === 3 && (
            <div className="bg-pit border border-white/15 p-6 sm:p-9 shadow-2xl relative space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <span className="label-spaced text-red block">STAGE 03</span>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-paper mt-0.5">
                    Upload Proof of Completion
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRefModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-paper text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-red" />
                    <span>View Reference Samples</span>
                  </button>
                </div>
              </div>

              {/* Verified Participant Context Banner */}
              <div className="p-4 bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-paper">
                  <UserCheck className="w-4 h-4 text-red" />
                  <span>
                    PARTICIPANT: <strong>{participant?.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-steel">
                  <Mail className="w-4 h-4 text-red" />
                  <span>
                    REQUIRED EMAIL: <strong className="text-paper">{participant?.email}</strong>
                  </span>
                </div>
              </div>

              {/* DUAL PROOF VERIFICATION CARDS */}
              <div className="space-y-6">
                {/* 1. PRIMARY PROOF: Confirmation Screen */}
                <div className="bg-[#161817] border border-white/15 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-none bg-red/20 border border-red/40 text-red-bright flex items-center justify-center font-mono text-xs font-bold">
                        01
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-paper uppercase tracking-wider">
                          Primary Check: Confirmation Screen
                        </h3>
                        <p className="text-xs text-steel">
                          Screenshot of &ldquo;You&apos;re in. Welcome to the heap.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div>
                      {proof1Result?.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>VERIFIED ({proof1Result.score}%)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/15 text-steel text-xs font-mono">
                          <span>AWAITING PROOF</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {!proof1File ? (
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        setProof1DragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleProof1Selected(e.dataTransfer.files[0]);
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setProof1DragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setProof1DragOver(false);
                      }}
                      onClick={() => proof1InputRef.current?.click()}
                      className={`border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        proof1DragOver
                          ? "border-red bg-red/10"
                          : "border-white/20 hover:border-white/40 bg-pit/50"
                      }`}
                    >
                      <input
                        ref={proof1InputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleProof1Selected(e.target.files[0]);
                          }
                        }}
                      />
                      <UploadCloud className="w-7 h-7 text-red mb-2" />
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-paper">
                        Upload Confirmation Screenshot
                      </div>
                      <div className="text-[11px] text-steel mt-1">
                        PNG, JPG, or WEBP (Max 10MB)
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-pit/50 p-4 border border-white/10">
                        <div className="w-24 h-16 bg-charcoal border border-white/20 overflow-hidden shrink-0">
                          {proof1Preview && (
                            <img
                              src={proof1Preview}
                              alt="Proof 1 preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="text-xs font-bold text-paper truncate">
                            {proof1File.name}
                          </div>
                          <div className="text-[11px] font-mono text-steel">
                            {(proof1File.size / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={resetProof1}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-steel hover:text-paper text-xs font-mono transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                      </div>

                      {proof1Analyzing && (
                        <div className="p-3.5 bg-white/5 border border-white/10 flex items-center justify-center gap-3 font-mono text-xs text-steel">
                          <RefreshCw className="w-4 h-4 text-red animate-spin" />
                          <span>Analyzing structural NCC & color similarity...</span>
                        </div>
                      )}

                      {!proof1Analyzing && proof1Result && (
                        <div
                          className={`p-4 border text-xs leading-relaxed ${
                            proof1Result.verified
                              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                              : "bg-red/10 border-red/40 text-red-bright"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {proof1Result.verified ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                            )}
                            <div>
                              <strong className="uppercase font-mono block">
                                {proof1Result.verified
                                  ? "Confirmation Verified!"
                                  : "Verification Rejected"}
                              </strong>
                              <span>{proof1Result.reason}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {proof1Error && !proof1Result?.verified && (
                        <div className="p-3 bg-red/10 border border-red/30 text-xs text-red-bright flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{proof1Error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. SECONDARY PROOF: Account Dashboard with Email */}
                <div className="bg-[#161817] border border-white/15 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-none bg-red/20 border border-red/40 text-red-bright flex items-center justify-center font-mono text-xs font-bold">
                        02
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-paper uppercase tracking-wider">
                            Secondary Check: Account Profile (Email ID)
                          </h3>
                          <span className="px-1.5 py-0.5 bg-red text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
                            Anti-Fraud
                          </span>
                        </div>
                        <p className="text-xs text-steel">
                          Screenshot of Account Profile displaying your registered email (
                          <span className="text-paper">{participant?.email}</span>)
                        </p>
                      </div>
                    </div>

                    <div>
                      {proof2Result?.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>EMAIL VERIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/15 text-steel text-xs font-mono">
                          <span>AWAITING PROOF</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {!proof2File ? (
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        setProof2DragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleProof2Selected(e.dataTransfer.files[0]);
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setProof2DragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setProof2DragOver(false);
                      }}
                      onClick={() => proof2InputRef.current?.click()}
                      className={`border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        proof2DragOver
                          ? "border-red bg-red/10"
                          : "border-white/20 hover:border-white/40 bg-pit/50"
                      }`}
                    >
                      <input
                        ref={proof2InputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleProof2Selected(e.target.files[0]);
                          }
                        }}
                      />
                      <ShieldCheck className="w-7 h-7 text-red mb-2" />
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-paper">
                        Upload Account Dashboard Screenshot
                      </div>
                      <div className="text-[11px] text-steel mt-1">
                        Must show the &ldquo;Account profile&rdquo; section and email
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-pit/50 p-4 border border-white/10">
                        <div className="w-24 h-16 bg-charcoal border border-white/20 overflow-hidden shrink-0">
                          {proof2Preview && (
                            <img
                              src={proof2Preview}
                              alt="Proof 2 preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="text-xs font-bold text-paper truncate">
                            {proof2File.name}
                          </div>
                          <div className="text-[11px] font-mono text-steel">
                            {(proof2File.size / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={resetProof2}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-steel hover:text-paper text-xs font-mono transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                      </div>

                      {/* OCR Progress Status */}
                      {proof2Analyzing && (
                        <div className="p-4 bg-white/5 border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono text-steel">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 text-red animate-spin" />
                              <span>{proof2Progress?.message || "Running Tesseract OCR..."}</span>
                            </div>
                            <span className="font-bold text-paper">
                              {proof2Progress?.progress || 25}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-pit border border-white/10 overflow-hidden">
                            <div
                              className="h-full bg-red transition-all duration-300"
                              style={{ width: `${proof2Progress?.progress || 25}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* OCR Verification Result */}
                      {!proof2Analyzing && proof2Result && (
                        <div
                          className={`p-4 border text-xs leading-relaxed ${
                            proof2Result.verified
                              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                              : "bg-red/10 border-red/40 text-red-bright"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {proof2Result.verified ? (
                              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                              <strong className="uppercase font-mono block">
                                {proof2Result.verified
                                  ? "Account & Email Ownership Authenticated!"
                                  : "Verification Incomplete"}
                              </strong>
                              <p>{proof2Result.reason}</p>

                              {proof2Result.detectedEmail && (
                                <div className="mt-2 pt-2 border-t border-emerald-500/30 font-mono text-[11px] text-emerald-300">
                                  Detected Credential:{" "}
                                  <span className="font-bold">{proof2Result.detectedEmail}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {proof2Error && !proof2Result?.verified && (
                        <div className="p-3 bg-red/10 border border-red/30 text-xs text-red-bright flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{proof2Error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* OVERALL STATUS BANNER */}
              <div
                className={`p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
                  isBothProofsVerified
                    ? "bg-emerald-950/50 border-emerald-500/60"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 flex items-center justify-center shrink-0 border ${
                      isBothProofsVerified
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-white/10 border-white/20 text-steel"
                    }`}
                  >
                    {isBothProofsVerified ? (
                      <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                    ) : (
                      <Lock className="w-5 h-5 text-steel" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                        isBothProofsVerified ? "text-emerald-300" : "text-paper"
                      }`}
                    >
                      {isBothProofsVerified
                        ? "Authentication Complete (2 of 2 Verified)"
                        : `Verification In Progress (${
                            (proof1Result?.verified ? 1 : 0) +
                            (proof2Result?.verified ? 1 : 0)
                          } of 2 Completed)`}
                    </h4>
                    <p className="text-[11px] text-steel">
                      {isBothProofsVerified
                        ? "Your sponsor task and identity are verified. You can now unlock your certificate!"
                        : "Both the confirmation screenshot and account dashboard screenshot are required."}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  {isBothProofsVerified ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setStep(4)}
                      className="w-full sm:w-auto justify-center text-xs py-3.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                      trailing={<ChevronRight className="w-4 h-4" />}
                    >
                      Continue to Certificate
                    </Button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto px-5 py-3 bg-white/5 text-steel/50 border border-white/10 text-xs font-mono uppercase cursor-not-allowed"
                    >
                      Awaiting 2 of 2 Checks
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-white/20 text-paper/80 hover:text-paper hover:border-white text-xs font-semibold uppercase tracking-button transition-colors cursor-pointer"
                >
                  ← Back to Task
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Download Certificate */}
          {step === 4 && (
            <div className="bg-pit border border-white/15 p-6 sm:p-9 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="label-spaced text-red block">STAGE 04 // FINAL</span>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-paper mt-0.5">
                    Your Certificate is Ready! 🏁
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red/20 border border-red/40 text-[11px] font-mono text-red-bright font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>AUTHENTICATED</span>
                </div>
              </div>

              {/* Participant & Event Banner */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-steel block">
                    ISSUED TO PARTICIPANT
                  </span>
                  <span className="text-base sm:text-lg font-bold text-paper font-sans">
                    {participant?.name}
                  </span>
                  <span className="text-xs font-mono text-steel block mt-0.5">
                    {participant?.email}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] font-mono text-steel block">
                    EVENT TRACK
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-red font-mono">
                    {currentEventInfo.displayName}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                    ✓ DUAL VERIFIED
                  </span>
                </div>
              </div>

              {/* Multi-event switcher if participant participated in multiple events */}
              {allMatchedEvents.length > 1 && (
                <div className="mb-6">
                  <label className="label-spaced text-xs text-steel block mb-2">
                    SWITCH EVENT CERTIFICATE:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allMatchedEvents.map((item) => {
                      const key = normalizeEventKey(item.event);
                      const isSelected = selectedEventKey === key;
                      const cfg = EVENT_CONFIG[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedEventKey(key)}
                          className={`px-3.5 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-red text-paper border-red"
                              : "bg-white/5 text-steel border-white/15 hover:border-white/30"
                          }`}
                        >
                          {cfg.displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Font Choice Switcher */}
              <div className="mb-4 flex items-center justify-between text-xs font-mono text-steel">
                <span>NAME TYPOGRAPHY STYLE:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFontChoice("Montserrat")}
                    className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                      fontChoice === "Montserrat"
                        ? "bg-red text-paper border-red font-bold"
                        : "bg-white/5 text-steel border-white/10 hover:border-white/20"
                    }`}
                  >
                    Montserrat (Bold)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontChoice("Caveat")}
                    className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                      fontChoice === "Caveat"
                        ? "bg-red text-paper border-red font-bold"
                        : "bg-white/5 text-steel border-white/10 hover:border-white/20"
                    }`}
                  >
                    Caveat (Script)
                  </button>
                </div>
              </div>

              {/* Live Canvas Certificate Preview */}
              <div className="bg-[#141515] p-3 sm:p-5 border border-white/20 shadow-inner mb-6 relative">
                {isGeneratingCert ? (
                  <div className="aspect-[4/3] flex flex-col items-center justify-center gap-3 text-steel">
                    <RefreshCw className="w-8 h-8 text-red animate-spin" />
                    <span className="text-xs font-mono">
                      Generating authenticated vector canvas...
                    </span>
                  </div>
                ) : certDataUrl ? (
                  <div className="relative group">
                    <img
                      src={certDataUrl}
                      alt={`Certificate of Participation for ${participant?.name}`}
                      className="w-full h-auto shadow-2xl border border-white/10 block"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-pit/90 border border-white/20 text-[10px] font-mono text-steel">
                      PREVIEW ONLY
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center text-steel text-xs font-mono">
                    Generating preview...
                  </div>
                )}
              </div>

              {/* Download & Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleDownload}
                  disabled={isGeneratingCert || !certDataUrl}
                  className="w-full justify-center text-sm py-4 cursor-pointer"
                  trailing={<Download className="w-4 h-4" />}
                >
                  Download Certificate (PNG)
                </Button>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setEmailInput("");
                      resetProof1();
                      resetProof2();
                    }}
                    className="text-steel hover:text-paper font-mono transition-colors cursor-pointer"
                  >
                    Claim for another participant
                  </button>

                  <a
                    href="/"
                    className="text-red hover:underline font-mono uppercase tracking-wider"
                  >
                    Back to IEEE Day 2026 →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reference Image Modal with Tabs for both samples */}
      {showRefModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowRefModal(false)}
        >
          <div
            className="bg-pit border border-white/20 max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red" />
                <span className="font-bold text-sm uppercase tracking-wider text-paper">
                  Reference Proof Examples
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 text-paper transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRefModalTab("confirmation")}
                className={`flex-1 py-2 px-3 text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  refModalTab === "confirmation"
                    ? "bg-red text-paper border-red"
                    : "bg-white/5 text-steel border-white/15 hover:border-white/30"
                }`}
              >
                Proof 1: Confirmation Screen
              </button>
              <button
                type="button"
                onClick={() => setRefModalTab("dashboard")}
                className={`flex-1 py-2 px-3 text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  refModalTab === "dashboard"
                    ? "bg-red text-paper border-red"
                    : "bg-white/5 text-steel border-white/15 hover:border-white/30"
                }`}
              >
                Proof 2: Account Profile (Email)
              </button>
            </div>

            {refModalTab === "confirmation" ? (
              <div>
                <p className="text-xs text-steel mb-3 font-mono">
                  Screenshot 1 must capture the confirmation screen saying &ldquo;You&apos;re in. Welcome to the heap.&rdquo;
                </p>

                <div
                  className="relative border border-white/20 overflow-hidden bg-black max-h-[60vh] flex items-center justify-center select-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src="/certificates/completed_task.jpeg"
                    alt="Heap Heap Hurray Confirmation Page Proof Example"
                    draggable={false}
                    className="max-h-[55vh] w-auto object-contain pointer-events-none select-none"
                  />

                  {/* Watermark Protection Shield */}
                  <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto select-none bg-black/20"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-30 -rotate-12 scale-125 overflow-hidden">
                      {[1, 2, 3, 4, 5].map((k) => (
                        <div
                          key={k}
                          className="flex justify-around text-red font-mono font-black text-xs sm:text-sm tracking-[0.25em] uppercase whitespace-nowrap drop-shadow"
                        >
                          <span>SAMPLE ONLY</span>
                          <span className="hidden sm:inline">DO NOT RE-UPLOAD</span>
                          <span>SAMPLE ONLY</span>
                        </div>
                      ))}
                    </div>

                    <div className="relative z-30 px-3.5 py-1.5 bg-pit/95 border border-red/60 text-paper text-xs font-mono uppercase tracking-wider shadow-2xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                      <span>Reference Preview Only • Protected Sample</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-steel mb-3 font-mono">
                  Screenshot 2 must capture your Account Profile on Heap Heap Hurray showing your registered email address.
                </p>

                <div
                  className="relative border border-white/20 overflow-hidden bg-black max-h-[60vh] flex items-center justify-center select-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src="/certificates/dashboard.jpeg"
                    alt="Heap Heap Hurray Account Profile Dashboard Proof Example"
                    draggable={false}
                    className="max-h-[55vh] w-auto object-contain pointer-events-none select-none"
                  />

                  {/* Watermark Protection Shield */}
                  <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto select-none bg-black/20"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-30 -rotate-12 scale-125 overflow-hidden">
                      {[1, 2, 3, 4, 5].map((k) => (
                        <div
                          key={k}
                          className="flex justify-around text-red font-mono font-black text-xs sm:text-sm tracking-[0.25em] uppercase whitespace-nowrap drop-shadow"
                        >
                          <span>SAMPLE ONLY</span>
                          <span className="hidden sm:inline">EMAIL CHECK</span>
                          <span>SAMPLE ONLY</span>
                        </div>
                      ))}
                    </div>

                    <div className="relative z-30 px-3.5 py-1.5 bg-pit/95 border border-red/60 text-paper text-xs font-mono uppercase tracking-wider shadow-2xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                      <span>Account Profile Example • Displays Email ID</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-mono text-steel">
                {refModalTab === "confirmation"
                  ? "Screen 1 of 2 required"
                  : "Screen 2 of 2 required"}
              </span>
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-paper text-xs font-semibold uppercase tracking-button transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12 bg-pit/50 text-center text-xs text-steel/60 font-mono">
        IEEE DAY 2026 // DTU IEEE SB × IEEE GTBIT SB // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

export default CertificateClaim;
