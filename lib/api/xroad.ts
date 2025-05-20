/**
 * xROAD API クライアントライブラリ
 * 国土交通省道路データプラットフォーム（xROAD）のAPIを呼び出すための関数を提供します
 */

// APIの設定値
const XROAD_API_KEY = process.env.XROAD_API_KEY || '';
const XROAD_API_BASE_URL = 'https://api.jartic-open-traffic.org/geoserver'; //復活させる
const PROXY_API_BASE_URL = '/api/xroad-proxy'; // Next.jsのAPIルート

/**
 * xROAD API呼び出し時に発生するエラー
 */
export class XRoadAPIError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'XRoadAPIError';
    this.status = status;
  }
}

/**
 * xROAD APIを呼び出す基本関数
 * すべてのAPI呼び出しはこの関数を通して行われます
 * 
 * @param url API呼び出し先のURL（クエリパラメータを含む）
 * @returns APIレスポンス
 */
export async function fetchFromXRoad(url: string) {
  // URLオブジェクトを作成。元々のurlにはクエリパラメータが含まれている想定
  // そのクエリパラメータをプロキシAPIのURLに付加する
  const originalUrl = new URL(url); // url は `https://api.jartic-open-traffic.org/geoserver?service=WFS&...` のような形式
  const proxyUrl = new URL(PROXY_API_BASE_URL, window.location.origin); // 第2引数で絶対URLを生成

  originalUrl.searchParams.forEach((value, key) => {
    proxyUrl.searchParams.append(key, value);
  });
  
  // APIキーの処理はプロキシ側で行うか、あるいはここで元のURLに付与していたものを削除（今回はコメントアウト済み）
  
  // APIを呼び出す
  const response = await fetch(proxyUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // エラーハンドリング
  if (!response.ok) {
    throw new XRoadAPIError(
      `xROAD API エラー: ${response.statusText}`, 
      response.status
    );
  }
  
  // レスポンスデータを返す
  return await response.json();
}

/**
 * 指定した位置の周辺道路の交通量データを取得する (新しいAPI仕様に基づく)
 * 様式1（常設トラカン_5分間交通量）を取得する想定
 *
 * @param latitude 緯度
 * @param longitude 経度
 * @param radius 検索半径（メートル） - この半径からBBOXを計算
 * @param dateTime 対象日時 (YYYYMMDDHHMM形式、HHMMは5分単位に補正される)
 * @param roadType 道路種別 (1:高速自動車国道, 3:一般国道など。API仕様書参照)
 * @returns 交通量データ
 */
export async function getRoadData(
  latitude: number,
  longitude: number,
  radius: number = 1000,
  dateTime: string,
  roadType: string = '3'
) {
  try {
    const url = new URL(XROAD_API_BASE_URL);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('version', '2.0.0');
    url.searchParams.append('request', 'GetFeature');
    url.searchParams.append('typeNames', 't_travospublic_measure_5m');
    url.searchParams.append('srsName', 'EPSG:4326');
    url.searchParams.append('outputFormat', 'application/json');
    url.searchParams.append('exceptions', 'application/json');

    const latOffset = radius / 111000;
    const lonOffset = radius / (111000 * Math.cos(latitude * Math.PI / 180));

    const minLon = longitude - lonOffset;
    const minLat = latitude - latOffset;
    const maxLon = longitude + lonOffset;
    const maxLat = latitude + latOffset;

    const year = dateTime.substring(0, 4);
    const month = dateTime.substring(4, 6);
    const day = dateTime.substring(6, 8);
    const hour = dateTime.substring(8, 10);
    let minute = parseInt(dateTime.substring(10, 12), 10);
    minute = Math.floor(minute / 5) * 5;
    const timeCode = `${year}${month}${day}${hour}${String(minute).padStart(2, '0')}`;

    // --- デバッグログ追加 ---
    console.log("[getRoadData] Input params:", { latitude, longitude, radius, dateTime, roadType });
    console.log("[getRoadData] Calculated BBOX:", { minLon, minLat, maxLon, maxLat });
    console.log("[getRoadData] Calculated timeCode:", timeCode);
    // --- ここまで ---

    const cqlFilterRoadType = `"道路種別"='${roadType}'`;
    const cqlFilterTimeCode = `"時間コード"=${timeCode}`; // 仕様書の例では数値扱いなのでクォートなし
    const cqlFilterBbox = `BBOX("ジオメトリ",${minLon},${minLat},${maxLon},${maxLat},'EPSG:4326')`;

    const cqlFilter = `${cqlFilterRoadType} AND ${cqlFilterTimeCode} AND ${cqlFilterBbox}`;

    // --- デバッグログ追加 ---
    console.log("[getRoadData] CQL RoadType part:", cqlFilterRoadType);
    console.log("[getRoadData] CQL TimeCode part:", cqlFilterTimeCode);
    console.log("[getRoadData] CQL BBOX part:", cqlFilterBbox);
    console.log("[getRoadData] Full CQL filter:", cqlFilter);
    // --- ここまで ---

    url.searchParams.append('cql_filter', cqlFilter);

    console.log("Request URL for getRoadData:", url.toString());

    const data = await fetchFromXRoad(url.toString());
    return data;
  } catch (error) {
    console.error('道路データ取得エラー (new spec):', error);
    if (error instanceof XRoadAPIError) {
        try {
            const concreteError = error as any;
            // concreteError.response が fetch の Response オブジェクトであることを期待
            // fetch の Response オブジェクトはステータスコードに関わらず存在するはず
            // ただし、ネットワークエラー等で response 自体がない場合も考慮
            if (concreteError.response && typeof concreteError.response.text === 'function') {
                const errorText = await concreteError.response.text();
                console.error('API Error Response Body (Text):', errorText);
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error('API Error Response Body (Parsed JSON):', errorJson);
                } catch (parseError) {
                    console.error('Failed to parse error response body as JSON, was text.');
                }
            } else if (concreteError.message) {
                 console.error('API Error Message (no concreteError.response):', concreteError.message);
            }
        } catch (e) {
            console.error('Failed to process/parse error response body:', e);
        }
    }
    throw error;
  }
}

/**
 * 指定した観測所の交通量データを取得する
 * 
 * @param observationCodes 観測所コード（カンマ区切りで複数指定可能）
 * @param from データ取得開始日時（YYYYMMDDHHMM形式）
 * @param to データ取得終了日時（YYYYMMDDHHMM形式）
 * @param isHourly 1時間値データを取得するかどうか（デフォルトはfalseで5分値）
 * @returns 交通量データ
 */
export async function getTrafficData(
  observationCodes: string,
  from: string,
  to: string,
  isHourly: boolean = false
) {
  try {
    // APIパラメータを構築
    const url = new URL(XROAD_API_BASE_URL);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('version', '2.0.0');
    url.searchParams.append('request', 'GetFeature');
    
    // 5分値または1時間値を指定
    if (isHourly) {
      url.searchParams.append('typeName', 'jartic:traffic_60min_fix');
      url.searchParams.append('YYYYMMDDHH_FROM', from.substring(0, 10));
      url.searchParams.append('YYYYMMDDHH_TO', to.substring(0, 10));
    } else {
      url.searchParams.append('typeName', 'jartic:traffic_5min_fix');
      url.searchParams.append('YYYYMMDDHHMM_FROM', from);
      url.searchParams.append('YYYYMMDDHHMM_TO', to);
    }
    
    url.searchParams.append('outputFormat', 'application/json');
    url.searchParams.append('MSTRKCODE', observationCodes);
    
    // APIリクエストを実行
    const data = await fetchFromXRoad(url.toString());
    return data;
  } catch (error) {
    console.error('交通量データ取得エラー:', error);
    throw error;
  }
}

/**
 * 指定した地域名から交通量データを取得する
 * 
 * @param placeName 地域名（路線名、区間名、都道府県名など）
 * @param from データ取得開始日時（YYYYMMDDHHMM形式）
 * @param to データ取得終了日時（YYYYMMDDHHMM形式）
 * @param isHourly 1時間値データを取得するかどうか（デフォルトはfalseで5分値）
 * @returns 交通量データ
 */
export async function getTrafficDataByPlace(
  placeName: string,
  from: string,
  to: string,
  isHourly: boolean = false
) {
  try {
    // APIパラメータを構築
    const url = new URL(XROAD_API_BASE_URL);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('version', '2.0.0');
    url.searchParams.append('request', 'GetFeature');
    
    // 5分値または1時間値を指定
    if (isHourly) {
      url.searchParams.append('typeName', 'jartic:traffic_60min_fix');
      url.searchParams.append('YYYYMMDDHH_FROM', from.substring(0, 10));
      url.searchParams.append('YYYYMMDDHH_TO', to.substring(0, 10));
    } else {
      url.searchParams.append('typeName', 'jartic:traffic_5min_fix');
      url.searchParams.append('YYYYMMDDHHMM_FROM', from);
      url.searchParams.append('YYYYMMDDHHMM_TO', to);
    }
    
    url.searchParams.append('outputFormat', 'application/json');
    url.searchParams.append('PLACE_NAME', placeName);
    
    // APIリクエストを実行
    const data = await fetchFromXRoad(url.toString());
    return data;
  } catch (error) {
    console.error('地域名による交通量データ取得エラー:', error);
    throw error;
  }
}

/**
 * 指定したメッシュコードから交通量データを取得する
 * 
 * @param meshCodes メッシュコード（カンマ区切りで複数指定可能）
 * @param from データ取得開始日時（YYYYMMDDHHMM形式）
 * @param to データ取得終了日時（YYYYMMDDHHMM形式）
 * @param isHourly 1時間値データを取得するかどうか（デフォルトはfalseで5分値）
 * @returns 交通量データ
 */
export async function getTrafficDataByMeshCode(
  meshCodes: string,
  from: string,
  to: string,
  isHourly: boolean = false
) {
  try {
    // APIパラメータを構築
    const url = new URL(XROAD_API_BASE_URL);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('version', '2.0.0');
    url.searchParams.append('request', 'GetFeature');
    
    // 5分値または1時間値を指定
    if (isHourly) {
      url.searchParams.append('typeName', 'jartic:traffic_60min_fix');
      url.searchParams.append('YYYYMMDDHH_FROM', from.substring(0, 10));
      url.searchParams.append('YYYYMMDDHH_TO', to.substring(0, 10));
    } else {
      url.searchParams.append('typeName', 'jartic:traffic_5min_fix');
      url.searchParams.append('YYYYMMDDHHMM_FROM', from);
      url.searchParams.append('YYYYMMDDHHMM_TO', to);
    }
    
    url.searchParams.append('outputFormat', 'application/json');
    url.searchParams.append('MESHCODE', meshCodes);
    
    // APIリクエストを実行
    const data = await fetchFromXRoad(url.toString());
    return data;
  } catch (error) {
    console.error('メッシュコードによる交通量データ取得エラー:', error);
    throw error;
  }
} 