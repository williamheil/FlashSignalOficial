import requests
import time
import json
from datetime import datetime

# URL do Webhook (Backend do Site)
WEBHOOK_URL = "https://trae4rlyhrxi.vercel.app/api/webhook"

def get_p2p_data():
    """
    Função que deve retornar o JSON com os dados das oportunidades.
    Substitua o conteúdo abaixo pela lógica do seu script que gera esses dados.
    """
    
    # Exemplo estático baseado no que você forneceu.
    # No seu caso, você vai gerar isso dinamicamente.
    timestamp_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "timestamp_gerado": timestamp_now,
        "total_oportunidades_analisadas": 16,
        "top_10_melhores_maker_opportunities": [
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "COINEX",
                "exchange_saida": "MEXC",
                "preco_entrada": 5.498,
                "preco_saida": 5.42,
                "comerciante_entrada": "TradingEDBG",
                "comerciante_saida": "BTS INTERMEDIAÇÕES",
                "diferenca_pct": 1.42,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "COINEX",
                "exchange_saida": "GATE",
                "preco_entrada": 5.498,
                "preco_saida": 5.428,
                "comerciante_entrada": "TradingEDBG",
                "comerciante_saida": "CletoJR P2P LTDA",
                "diferenca_pct": 1.27,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "COINEX",
                "exchange_saida": "BINANCE",
                "preco_entrada": 5.498,
                "preco_saida": 5.431,
                "comerciante_entrada": "TradingEDBG",
                "comerciante_saida": "Corleonne_Commerce",
                "diferenca_pct": 1.22,
                "timestamp": timestamp_now
            },
            {
                "tipo": "mesma_exchange",
                "exchange": "COINEX",
                "preco_entrada": 5.498,
                "preco_saida": 5.432,
                "comerciante_entrada": "TradingEDBG",
                "comerciante_saida": "TradingEDBG",
                "diferenca_pct": 1.2,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "GATE",
                "exchange_saida": "MEXC",
                "preco_entrada": 5.474,
                "preco_saida": 5.42,
                "comerciante_entrada": "Flash Crypto",
                "comerciante_saida": "BTS INTERMEDIAÇÕES",
                "diferenca_pct": 0.99,
                "timestamp": timestamp_now
            },
            {
                "tipo": "mesma_exchange",
                "exchange": "GATE",
                "preco_entrada": 5.474,
                "preco_saida": 5.428,
                "comerciante_entrada": "Flash Crypto",
                "comerciante_saida": "CletoJR P2P LTDA",
                "diferenca_pct": 0.84,
                "timestamp": timestamp_now
            },
            {
                "tipo": "mesma_exchange",
                "exchange": "MEXC",
                "preco_entrada": 5.465,
                "preco_saida": 5.42,
                "comerciante_entrada": "Cripto Cubaton",
                "comerciante_saida": "BTS INTERMEDIAÇÕES",
                "diferenca_pct": 0.82,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "GATE",
                "exchange_saida": "BINANCE",
                "preco_entrada": 5.474,
                "preco_saida": 5.431,
                "comerciante_entrada": "Flash Crypto",
                "comerciante_saida": "Corleonne_Commerce",
                "diferenca_pct": 0.79,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "GATE",
                "exchange_saida": "COINEX",
                "preco_entrada": 5.474,
                "preco_saida": 5.432,
                "comerciante_entrada": "Flash Crypto",
                "comerciante_saida": "TradingEDBG",
                "diferenca_pct": 0.77,
                "timestamp": timestamp_now
            },
            {
                "tipo": "entre_exchanges",
                "exchange_entrada": "MEXC",
                "exchange_saida": "GATE",
                "preco_entrada": 5.465,
                "preco_saida": 5.428,
                "comerciante_entrada": "Cripto Cubaton",
                "comerciante_saida": "CletoJR P2P LTDA",
                "diferenca_pct": 0.68,
                "timestamp": timestamp_now
            }
        ],
        "explicacao": {
            "logica": "Ordenado da maior % para a menor % (em valor absoluto). A maior diferença indica o potencial de lucro máximo para o maker."
        }
    }

def main():
    print("Iniciando monitoramento P2P...")
    print(f"Target URL: {WEBHOOK_URL}")
    print("Pressione Ctrl+C para parar.")
    
    while True:
        try:
            # 1. Obtém os dados (do seu script)
            data = get_p2p_data()
            
            # 2. Envia para o Webhook
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Enviando {len(data['top_10_melhores_maker_opportunities'])} oportunidades...")
            
            response = requests.post(WEBHOOK_URL, json=data)
            
            # 3. Verifica resposta
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Sucesso! {result.get('message')}")
            else:
                print(f"❌ Erro {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Erro de conexão: {e}")
        except Exception as e:
            print(f"❌ Erro inesperado: {e}")
            
        # 4. Aguarda 60 segundos
        print("Aguardando 1 minuto...")
        time.sleep(60)

if __name__ == "__main__":
    main()
