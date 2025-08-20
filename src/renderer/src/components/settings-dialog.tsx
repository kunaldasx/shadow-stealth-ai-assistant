import { useEffect, useState } from "react";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	Dialog,
	DialogDescription,
	DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@renderer/providers/toast-context";

type APIProvider = "openai" | "gemini";

type AIModel = {
	id: string;
	name: string;
	description: string;
};

type ModelCategory = {
	key: "extractionModel" | "solutionModel" | "debuggingModel";
	title: string;
	description: string;
	openaiModels: AIModel[];
	geminiModels: AIModel[];
};

interface Config {
	apiKey?: string;
	apiProvider?: "openai" | "gemini";
	extractionModel?: string;
	solutionModel?: string;
	debuggingModel?: string;
}

const modelCategories: ModelCategory[] = [
	{
		key: "extractionModel",
		title: "Problem Extraction",
		description:
			"Model used to analyze the screenshots and extract the problem statement",
		openaiModels: [
			{
				id: "gpt-5",
				name: "GPT-5",
				description:
					"Most advanced for complex reasoning and accurate problem extraction",
			},
			{
				id: "gpt-4o",
				name: "GPT-4o",
				description:
					"State-of-the-art multimodal model, excellent for vision and extraction",
			},
			{
				id: "o4-mini",
				name: "o4-mini",
				description:
					"Efficient and cost-effective option for extraction with deep reasoning",
			},
		],
		geminiModels: [
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro",
				description:
					"Most advanced reasoning for complex problem extraction",
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash",
				description:
					"Best balance for screenshot analysis and problem extraction",
			},
			{
				id: "gemini-2.5-flash-lite",
				name: "Gemini 2.5 Flash-Lite",
				description:
					"Fast and cost-effective for problem extraction with high quota",
			},
		],
	},

	{
		key: "solutionModel",
		title: "Solution Generation",
		description: "Model used to generate the solution to the problem",
		openaiModels: [
			{
				id: "gpt-5",
				name: "GPT-5",
				description: "Most advanced coding performance and reasoning",
			},
			{
				id: "gpt-4o",
				name: "GPT-4o",
				description:
					"State-of-the-art multimodal model for code generation",
			},
			{
				id: "o4-mini",
				name: "o4-mini",
				description:
					"Strong reasoning and efficient solution generation",
			},
		],
		geminiModels: [
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro",
				description:
					"Most advanced reasoning for complex coding solutions",
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash",
				description:
					"Fast and reliable solution generation with good quality",
			},
			{
				id: "gemini-2.5-flash-lite",
				name: "Gemini 2.5 Flash-Lite",
				description:
					"High-quota, cost-effective model for solution generation",
			},
		],
	},
	{
		key: "debuggingModel",
		title: "Debugging",
		description: "Model used to debug the solution",
		openaiModels: [
			{
				id: "gpt-5",
				name: "GPT-5",
				description: "Most advanced debugging and code analysis",
			},
			{
				id: "gpt-4o",
				name: "GPT-4o",
				description: "State-of-the-art multimodal model for debugging",
			},
			{
				id: "o4-mini",
				name: "o4-mini",
				description: "Effective debugging with strong reasoning",
			},
		],
		geminiModels: [
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro",
				description: "Most advanced reasoning for debugging",
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash",
				description:
					"Balanced debugging assistance with good reasoning",
			},
			{
				id: "gemini-2.5-flash-lite",
				name: "Gemini 2.5 Flash-Lite",
				description:
					"High-quota model perfect for debugging iterations",
			},
		],
	},
];

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({
	open: openProp,
	onOpenChange,
}: SettingsDialogProps) {
	const [open, setOpen] = useState(openProp || false);
	console.log("open", open);
	const [apiKey, setApiKey] = useState("");
	const [apiProvider, setApiProvider] = useState<APIProvider>("gemini");
	const [extractionModel, setExtractionModel] = useState("gemini-2.5-flash");
	const [solutionModel, setSolutionModel] = useState("gemini-2.5-flash");
	const [debuggingModel, setDebuggingModel] = useState("gemini-2.5-flash");

	const [currentConfig, setCurrentConfig] = useState<Config | null>();
	const [isLoading, setIsLoading] = useState(false);

	const { showToast } = useToast();

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (onOpenChange && newOpen !== openProp) {
			onOpenChange(newOpen);
		}
	};

	useEffect(() => {
		if (openProp !== undefined) {
			setOpen(openProp);
		}
	}, [openProp]);

	const handleProviderChange = (provider: APIProvider) => {
		setApiProvider(provider);

		if (currentConfig?.apiProvider === provider) {
			if (provider === "openai") {
				setExtractionModel(currentConfig?.extractionModel || "gpt-4o");
				setSolutionModel(currentConfig?.solutionModel || "gpt-4o");
				setDebuggingModel(currentConfig?.debuggingModel || "gpt-4o");
			} else {
				setExtractionModel(
					currentConfig?.extractionModel || "gemini-2.5-flash"
				);
				setSolutionModel(
					currentConfig?.solutionModel || "gemini-2.5-flash"
				);
				setDebuggingModel(
					currentConfig?.debuggingModel || "gemini-2.5-flash"
				);
			}
		} else {
			if (provider === "openai") {
				setExtractionModel("gpt-4o");
				setSolutionModel("gpt-4o");
				setDebuggingModel("gpt-4o");
			} else {
				setExtractionModel("gemini-2.5-flash");
				setSolutionModel("gemini-2.5-flash");
				setDebuggingModel("gemini-2.5-flash");
			}
		}
	};

	const maskApiKey = (key: string) => {
		if (!key) return "";
		return `${key.substring(0, 4)}....${key.substring(key.length - 4)}`;
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const result = await window.electronAPI.updateConfig({
				apiKey,
				apiProvider,
				extractionModel,
				solutionModel,
				debuggingModel,
			});

			setCurrentConfig({
				apiKey,
				apiProvider,
				extractionModel,
				solutionModel,
				debuggingModel,
			});

			if (result) {
				showToast("Success", "Settings saved successfully", "success");
				handleOpenChange(false);

				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} catch (error) {
			console.error("Failed to save settings:", error);
			showToast("Error", "Failed to save settings", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const openExternalLink = (url: string) => {
		window.electronAPI.openLink(url);
	};

	useEffect(() => {
		if (open) {
			setIsLoading(true);

			window.electronAPI
				.getConfig()
				.then((config: Config) => {
					setApiKey(config.apiKey || "");

					setApiProvider(config.apiProvider || "gemini");
					setExtractionModel(
						config.extractionModel || "gemini-2.5-flash"
					);
					setSolutionModel(
						config.solutionModel || "gemini-2.5-flash"
					);
					setDebuggingModel(
						config.debuggingModel || "gemini-2.5-flash"
					);

					setCurrentConfig({
						apiKey: config.apiKey,
						apiProvider: config.apiProvider,
						extractionModel: config.extractionModel,
						solutionModel: config.solutionModel,
						debuggingModel: config.debuggingModel,
					});
				})
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.catch((error: any) => {
					console.error("Failed to fetch config:", error);
					showToast("Error", "Failed to load settings", "error");
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [open, showToast]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className="sm:max-w-md bg-black border border-white/25 text-white rounded-xl"
				style={{
					position: "fixed",
					top: "90%",
					left: "90%",
					transform: "translate(-50%, -50%)",
					width: "min(450px, 90vw)",
					height: "auto",
					minHeight: "400px",
					maxHeight: "90vh",
					overflowY: "auto",
					zIndex: 9999,
					margin: "12px",
					padding: "20px",
					transition: "opacity 0.25s ease, transform 0.25s ease",
					animation: "fadeIn 0.25s ease forwards",
					opacity: 0.98,
					transformOrigin: "center",
					backfaceVisibility: "hidden",
					willChange: "transform, opacity",
				}}
			>
				<DialogHeader>
					<DialogTitle>API Settings</DialogTitle>
					<DialogDescription>
						Configure your API key and model preferences.
						You&apos;ll need your own API key to use this
						application.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-white">
							API Provider
						</label>
						<div className="flex gap-2">
							<div
								className={`flex-1 p-2 rounded-lg cursor-pointer transition-colors ${
									apiProvider === "openai"
										? "bg-white/10 border border-white/50"
										: "bg-black/30 border border-white/5 hover:bg-white/5"
								}`}
								onClick={() => handleProviderChange("openai")}
							>
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											apiProvider === "openai"
												? "bg-white"
												: "bg-white/20"
										}`}
									/>
									<div className="flex flex-col">
										<p className="font-medium text-white text-sm">
											OpenAI
										</p>
										<p className="text-xs text-white/60">
											GPT-4o models
										</p>
									</div>
								</div>
							</div>
							<div
								className={`flex-1 p-2 rounded-lg cursor-pointer transition-colors ${
									apiProvider === "gemini"
										? "bg-white/10 border border-white/50"
										: "bg-black/30 border border-white/5 hover:bg-white/5"
								}`}
								onClick={() => handleProviderChange("gemini")}
							>
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											apiProvider === "gemini"
												? "bg-white"
												: "bg-white/20"
										}`}
									/>
									<div className="flex flex-col">
										<p className="font-medium text-white text-sm">
											Gemini
										</p>
										<p className="text-xs text-white/60">
											Gemini 2.5 models
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<label
							className="text-sm font-medium text-white"
							htmlFor="apiKey"
						>
							{apiProvider === "openai"
								? "OpenAI API Key"
								: "Google AI Studio API Key"}
						</label>
						<Input
							id="apiKey"
							type="password"
							placeholder={
								apiProvider === "openai" ? "sk-..." : "AIza..."
							}
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							className="bg-black/50 border-white/10 text-white"
						/>
						{apiKey && (
							<p className="text-xs text-white/50">
								Current {maskApiKey(apiKey)}
							</p>
						)}
						<p className="text-xs text-white/50">
							Your API key is stored locally in your browser. It
							is not sent to any servers.
							{apiProvider === "gemini" ? "OpenAI" : "Google"}
						</p>
						<div className="mt-2 p-2 rounded-md bg-white/5 border border-white/10">
							<p className="text-xs text-white/80 mb-1">
								Don&apos;t have an API key?
							</p>
							{apiProvider === "openai" ? (
								<>
									<p className="text-xs text-white/60 mb-1">
										1. Create an account at{" "}
										<button
											onClick={() =>
												openExternalLink(
													"https://platform.openai.com/signup"
												)
											}
											className="text-blue-400 hover:underline cursor-pointer"
										>
											OpenAI
										</button>
									</p>
									<p className="text-xs text-white/60 mb-1">
										2. Go to{" "}
										<button
											onClick={() =>
												openExternalLink(
													"https://platform.openai.com/api-keys"
												)
											}
											className="text-blue-400 hover:underline cursor-pointer"
										>
											API Keys
										</button>
									</p>
									<p className="text-xs text-white/60">
										3. Create an API key and paste it here
									</p>
								</>
							) : (
								<>
									<p className="text-xs text-white/60 mb-1">
										1. Create an account at{" "}
										<button
											onClick={() =>
												openExternalLink(
													"https://aistudio.google.com/"
												)
											}
											className="text-blue-400 hover:underline cursor-pointer"
										>
											Google AI Studio
										</button>
									</p>
									<p className="text-xs text-white/60 mb-1">
										2. Go to{" "}
										<button
											onClick={() =>
												openExternalLink(
													"https://aistudio.google.com/app/apikey"
												)
											}
											className="text-blue-400 hover:underline cursor-pointer"
										>
											API Keys
										</button>
									</p>
									<p className="text-xs text-white/60">
										3. Create an API key and paste it here
									</p>
								</>
							)}
						</div>
					</div>
					<div className="space-y-2 mt-4">
						<label className="text-sm font-medium text-white mb-2 block">
							Keyboard Shortcuts
						</label>
						<div className="bg-black/30 border border-white/10 rounded-lg p-3">
							<div className="grid grid-cols-2 gap-y-2 text-xs">
								<div className="text-white/70">
									Toggle Visibility
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+B / Cmd+B
								</div>

								<div className="text-white/70">
									Toggle Mouse Click
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+; / Cmd+;
								</div>

								<div className="text-white/70">
									Take Screenshot
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+H / Cmd+H
								</div>

								<div className="text-white/70">
									Process Screenshot
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+Enter / Cmd+Enter
								</div>

								<div className="text-white/70">
									Delete Last Screenshot
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+L / Cmd+L
								</div>

								<div className="text-white/70">Reset View</div>
								<div className="text-white/90 font-mono">
									Ctrl+R / Cmd+R
								</div>

								<div className="text-white/70">
									Quit Application
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+Q / Cmd+Q
								</div>

								<div className="text-white/70">Move Window</div>
								<div className="text-white/90 font-mono">
									Ctrl+Arrow Keys
								</div>

								<div className="text-white/70">
									Reset Window Position
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+' / Cmd+'
								</div>

								<div className="text-white/70">
									Decrease Opacity
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+[ / Cmd+[
								</div>

								<div className="text-white/70">
									Increase Opacity
								</div>
								<div className="text-white/90 font-mono">
									Ctrl+] / Cmd+]
								</div>

								<div className="text-white/70">Zoom Out</div>
								<div className="text-white/90 font-mono">
									Ctrl+- / Cmd+-
								</div>

								<div className="text-white/70">Zoom In</div>
								<div className="text-white/90 font-mono">
									Ctrl+= / Cmd+=
								</div>

								<div className="text-white/70">Reset Zoom</div>
								<div className="text-white/90 font-mono">
									Ctrl+0 / Cmd+0
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4 mt-4">
						<label className="text-sm font-semibold text-white">
							AI Model Selection
						</label>
						<p className="text-xs text-white/60 mt-1 mb-4">
							Select which models to use for each stage of the
							process
						</p>
						{modelCategories.map((category) => {
							const models =
								apiProvider === "openai"
									? category.openaiModels
									: category.geminiModels;

							return (
								<div key={category.key} className="mb-4">
									<label className="text-sm font-medium text-white block mb-1">
										{category.title}
									</label>
									<p className="text-xs text-white/60 mb-2">
										{category.description}
									</p>
									<div className="space-y-2">
										{models.map((m) => {
											const currentValue =
												category.key ===
												"extractionModel"
													? extractionModel
													: category.key ===
														  "solutionModel"
														? solutionModel
														: debuggingModel;

											const setValue =
												category.key ===
												"extractionModel"
													? setExtractionModel
													: category.key ===
														  "solutionModel"
														? setSolutionModel
														: setDebuggingModel;

											return (
												<div
													key={m.id}
													className={`p-2 rounded-lg cursor-pointer transition-colors ${
														currentValue === m.id
															? "bg-white/10 border border-white/50"
															: "bg-black/30 border border-white/5 hover:bg-white/5"
													}`}
													onClick={() =>
														setValue(m.id)
													}
												>
													<div className="flex items-center gap-2">
														<div
															className={`w-3 h-3 rounded-full ${
																currentValue ===
																m.id
																	? "bg-white"
																	: "bg-white/20"
															}`}
														/>
														<div className="flex flex-col">
															<p className="font-medium text-white text-sm">
																{m.name}
															</p>
															<p className="text-xs text-white/60">
																{m.description}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<DialogFooter className="flex justify-between gap-2">
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						className="border-white/20 hover:bg-white/5 px-6 text-white rounded-lg"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isLoading || !apiKey}
						className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
