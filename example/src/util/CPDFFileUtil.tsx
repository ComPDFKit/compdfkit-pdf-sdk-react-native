import * as RNFS from 'react-native-fs';

export class CPDFFileUtil {

    private cacheDirectory: string;

    constructor(cacheDirectory: string = RNFS.CachesDirectoryPath) {
        this.cacheDirectory = cacheDirectory;
    }

    async getUniqueFilePath(baseName: string, extension: string): Promise<string> {
        let counter = 1;
        let filePath = `${this.cacheDirectory}/${baseName}.${extension}`;

        while (await RNFS.exists(filePath)) {
            filePath = `${this.cacheDirectory}/${baseName}(${counter}).${extension}`;
            counter++;
        }

        return filePath;
    }

}