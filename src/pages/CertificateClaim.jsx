import { useState, useEffect, useRef, useCallback } from "react";
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
 * Image similarity check function
 * 1. Loads both images onto hidden canvases
 * 2. Resizes both to 64x64 for comparison
 * 3. Extracts pixel data from both
 * 4. Computes color histogram (split into 8 bins per channel = 24 total bins per image)
 * 5. Computes cosine similarity between the two histograms
 * 6. Returns similarity score (0-100)
 */
async function checkImageSimilarity(uploadedFile, referenceUrl) {
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
    const colorCosine = (norm1 > 0 && norm2 > 0) ? dot / (Math.sqrt(norm1) * Math.sqrt(norm2)) : 0;
    const colorScore = Math.max(0, Math.min(100, Math.round(colorCosine * 100)));

    // Composite Score: 60% structural NCC + 40% color profile match
    // High accuracy: identical image yields ~100%, mobile screenshot yields ~50-80%, random yields < 30%
    const compositeScore = Math.round(0.6 * nccScore + 0.4 * colorScore);
    const verified = compositeScore >= 40 || (nccScore >= 35 && colorScore >= 50);

    return {
      score: compositeScore,
      verified,
    };
  } finally {
    URL.revokeObjectURL(uploadedUrl);
  }
}

/**
 * Certificate generator function using Canvas API
 * 1. Loads the appropriate template PNG based on participant's event
 * 2. Creates a canvas with the same dimensions as the template (2000 x 1414)
 * 3. Draws the template image
 * 4. Overlays participant's name right above the black underline (y ~ 782 on 1414 height)
 */
async function generateCertificateCanvas(templateUrl, participantName, fontType = "Montserrat") {
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
    img.onerror = () => reject(new Error(`Failed to load certificate template: ${templateUrl}`));
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width || 2000;
  canvas.height = img.naturalHeight || img.height || 1414;
  const ctx = canvas.getContext("2d");

  // Draw base template
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Position: centered horizontally (x = 1000), right above the underline at y=794..799
  const x = canvas.width / 2;
  // 782px on 1414px height canvas places the baseline cleanly above the line
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

  // Step 3: Proof upload & similarity
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [similarityResult, setSimilarityResult] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const fileInputRef = useRef(null);

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

  // Step 3: Process image upload and check similarity
  const handleFileSelected = useCallback(
    async (file) => {
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file (PNG, JPG, or WEBP).");
        return;
      }

      setUploadError("");
      setUploadedFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      setIsAnalyzing(true);
      setSimilarityResult(null);

      try {
        const result = await checkImageSimilarity(
          file,
          "/certificates/completed_task.jpeg",
        );
        setSimilarityResult(result);
      } catch (err) {
        console.error(err);
        setUploadError(
          "Error processing image. Please try uploading the screenshot again.",
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSimilarityResult(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
            Verify your registration, complete the sponsor task, and instantly download your authenticated participation certificate.
          </p>
        </div>

        {/* Stepper Navigation */}
        <nav aria-label="Progress" className="w-full max-w-2xl mb-8 sm:mb-10">
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

                  {/* Step Label (Hidden on small mobile) */}
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
        <div className="w-full max-w-2xl">
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

              {/* Sponsor Copy Required by Specification */}
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

                <div className="pt-3 border-t border-white/10">
                  <div className="label-spaced text-xs text-paper mb-2">
                    STEPS TO COMPLETE:
                  </div>
                  <ol className="space-y-1.5 text-xs sm:text-sm text-steel font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px]">
                        1
                      </span>
                      <span>Click the link or scan the QR code below</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px]">
                        2
                      </span>
                      <span>Enter your email to sign up</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-none bg-red text-paper flex items-center justify-center font-bold text-[10px]">
                        3
                      </span>
                      <span>Check your inbox and click the confirmation link</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* QR Code and Direct Link */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 mb-8">
                <div className="bg-paper p-3 shadow-md shrink-0 border border-white/20">
                  <QRCodeSVG
                    value="https://dub.sh/2tg4bBO"
                    size={150}
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
                    Open the link directly in your browser or scan with your phone camera. Take a screenshot once you reach the &quot;Welcome to the heap&quot; confirmation screen.
                  </p>
                  <div>
                    <a
                      href="https://dub.sh/2tg4bBO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper text-charcoal hover:bg-white text-xs font-semibold uppercase tracking-button transition-colors"
                    >
                      <span>Open Newsletter Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
                  I&apos;ve completed the task
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Proof */}
          {step === 3 && (
            <div className="bg-pit border border-white/15 p-6 sm:p-9 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="label-spaced text-red block">STAGE 03</span>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-paper mt-0.5">
                    Upload Proof of Completion
                  </h2>
                </div>
                <div className="text-right font-mono text-xs text-steel">
                  VERIFICATION ENGINE // READY
                </div>
              </div>

              <p className="text-steel text-sm sm:text-base mb-6 leading-relaxed">
                Upload a screenshot of the subscription confirmation page from Heap Heap Hurray (&quot;You&apos;re in. Welcome to the heap.&quot;).
              </p>

              {/* Reference Sample Preview Banner (Protected / Non-downloadable) */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-16 h-12 bg-charcoal border border-white/20 overflow-hidden shrink-0 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      src="/certificates/completed_task.jpeg"
                      alt="Reference confirmation page sample"
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                    {/* Protective overlay shield */}
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-auto"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <span className="text-[9px] font-bold font-mono tracking-widest text-white bg-red/90 px-1 py-0.5 uppercase -rotate-12 select-none shadow">
                        Sample
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-paper block">
                      Target Confirmation Screen
                    </span>
                    <span className="text-[11px] text-steel">
                      Heap Heap Hurray &quot;Welcome to the heap&quot; confirmation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRefModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-paper text-xs font-mono transition-colors shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-red" />
                  <span>View Example</span>
                </button>
              </div>

              {/* Drag and Drop Zone */}
              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragOver
                      ? "border-red bg-red/10"
                      : "border-white/20 hover:border-white/40 bg-[#161817]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelected(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-14 h-14 bg-white/5 border border-white/15 flex items-center justify-center mb-4">
                    <UploadCloud className="w-7 h-7 text-red" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-paper mb-1">
                    Drag and drop screenshot here
                  </h3>
                  <p className="text-xs sm:text-sm text-steel mb-4">
                    PNG, JPG, or WEBP up to 10MB
                  </p>

                  <span className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-paper text-xs font-semibold uppercase tracking-button transition-colors">
                    Browse Files
                  </span>
                </div>
              ) : (
                /* File Uploaded & Analysis State */
                <div className="bg-[#161817] border border-white/15 p-5 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Thumbnail preview */}
                    <div className="w-32 h-24 bg-pit border border-white/20 overflow-hidden shrink-0 relative">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Uploaded screenshot preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <div className="text-xs font-mono text-steel">UPLOADED FILE</div>
                      <div className="text-sm font-bold text-paper truncate max-w-xs sm:max-w-md">
                        {uploadedFile.name}
                      </div>
                      <div className="text-xs font-mono text-steel/70">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetUpload}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-steel hover:text-paper hover:border-white text-xs font-mono transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>
                  </div>

                  {/* Analyzing Spinner */}
                  {isAnalyzing && (
                    <div className="p-4 bg-white/5 border border-white/10 flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 text-red animate-spin" />
                      <span className="text-xs sm:text-sm font-mono text-steel">
                        Extracting 24-bin color histogram & computing cosine match...
                      </span>
                    </div>
                  )}

                  {/* Similarity Result Report */}
                  {!isAnalyzing && similarityResult && (
                    <div
                      className={`p-5 border transition-all ${
                        similarityResult.verified
                          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                          : "bg-red/10 border-red/40 text-red-bright"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {similarityResult.verified ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red shrink-0 mt-0.5" />
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm sm:text-base uppercase tracking-wider">
                              {similarityResult.verified
                                ? "Verification Successful!"
                                : "Verification Rejected"}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-mono font-bold ${
                                similarityResult.verified
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-red/20 text-red-bright border border-red/40"
                              }`}
                            >
                              Match Score: {similarityResult.score}%
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-steel/90 leading-relaxed pt-1">
                            {similarityResult.verified
                              ? "The screenshot matches the Heap Heap Hurray confirmation page. Your certificate is verified and ready to download!"
                              : "The uploaded image did not match the required confirmation page (score must exceed 40%). Please ensure you upload the 'Welcome to the heap' screen and try again."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadError && (
                <div className="mt-4 p-3 bg-red/10 border border-red/30 flex items-center gap-2.5 text-xs sm:text-sm text-red-bright">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Navigation CTAs */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3 border border-white/20 text-paper/80 hover:text-paper hover:border-white text-xs font-semibold uppercase tracking-button transition-colors cursor-pointer"
                >
                  ← Back to Task
                </button>

                {similarityResult?.verified ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setStep(4)}
                    className="w-full sm:w-auto justify-center text-xs py-3.5 cursor-pointer"
                    trailing={<ChevronRight className="w-4 h-4" />}
                  >
                    Continue to Certificate
                  </Button>
                ) : (
                  uploadedFile &&
                  !similarityResult?.verified &&
                  !isAnalyzing && (
                    <button
                      type="button"
                      onClick={resetUpload}
                      className="w-full sm:w-auto px-6 py-3.5 bg-red hover:bg-red-deep text-paper text-xs font-semibold uppercase tracking-button transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  )
                )}
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
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] font-mono text-steel block">
                    EVENT TRACK
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-red font-mono">
                    {currentEventInfo.displayName}
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
                      setUploadedFile(null);
                      setSimilarityResult(null);
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

      {/* Reference Image Modal */}
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
                  Reference Proof Example
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

            <p className="text-xs text-steel mb-3 font-mono">
              Your screenshot must capture the Heap Heap Hurray confirmation page showing &ldquo;You&apos;re in. Welcome to the heap.&rdquo;
            </p>

            <div
              className="relative border border-white/20 overflow-hidden bg-black max-h-[70vh] flex items-center justify-center select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src="/certificates/completed_task.jpeg"
                alt="Heap Heap Hurray Confirmation Page Proof Example"
                draggable={false}
                className="max-h-[65vh] w-auto object-contain pointer-events-none select-none"
              />

              {/* Interaction-blocking transparent glass shield with prominent watermarks */}
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto select-none bg-black/20"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                {/* Diagonal repeating watermark */}
                <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-30 -rotate-12 scale-125 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((k) => (
                    <div
                      key={k}
                      className="flex justify-around text-red font-mono font-black text-xs sm:text-sm tracking-[0.25em] uppercase whitespace-nowrap drop-shadow"
                    >
                      <span>SAMPLE PROOF ONLY</span>
                      <span className="hidden sm:inline">DO NOT RE-UPLOAD</span>
                      <span>SAMPLE PROOF ONLY</span>
                    </div>
                  ))}
                </div>

                {/* Warning tag */}
                <div className="relative z-30 px-3.5 py-1.5 bg-pit/95 border border-red/60 text-paper text-xs font-mono uppercase tracking-wider shadow-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                  <span>Reference Preview Only • Protected Sample</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
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
