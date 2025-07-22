type StockfishRequest = {
  command: string[];
  onInfo?: (info: string) => void;
  onBestMove?: (move: string) => void;
};

export class StockfishWorker {
  private worker: Worker | null = null;
  private isReady = false;
  private requestQueue: StockfishRequest[] = [];
  private currentRequest: StockfishRequest | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.worker = new Worker('/sf17/stockfish-17.js');
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = (e) => console.error('Stockfish worker error:', e);
      this.init();
    }
  }

  private init() {
    // Send these directly, not through the queue
    this.sendCommand('uci');
    this.sendCommand('isready');
  }

  private handleMessage(e: MessageEvent) {
    const line = typeof e.data === 'string' ? e.data : '';
    // Debug log
    console.log('[Stockfish Worker handleMessage]', line);

    if (line === 'readyok') {
      this.isReady = true;
      this.processQueue();
    }
    if (line.startsWith('info') && this.currentRequest?.onInfo) {
      this.currentRequest.onInfo(line);
    }
    if (line.startsWith('bestmove') && this.currentRequest?.onBestMove) {
      this.currentRequest.onBestMove(line);
      this.currentRequest = null;
      this.processQueue();
    }
  }

  private processQueue() {
    console.log('[StockfishWorker] processQueue called. currentRequest:', this.currentRequest, 'queue:', this.requestQueue.length);
    if (this.isReady && !this.currentRequest && this.requestQueue.length > 0) {
      this.currentRequest = this.requestQueue.shift()!;
      for (const cmd of this.currentRequest.command) {
        this.sendCommand(cmd);
      }
    }
  }

  public analyze(fen: string, onInfo: (info: string) => void, onBestMove: (move: string) => void) {
    this.requestQueue.push({
      command: [
        `position fen ${fen}`,
        "setoption name MultiPV value 4",
        "go depth 18"
      ],
      onInfo,
      onBestMove,
    });
    this.processQueue();
  }

  public sendCommand(cmd: string) {
    if (this.worker) {
      console.log('[Stockfish Worker] Sending command:', cmd);
      this.worker.postMessage(cmd);
    }
  }

  public terminate() {
    console.log("terminate");
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
} 