require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-compdfkit-pdf"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "ComPDFKit"
  s.dependency "ComPDFKit_Tools"
  # React Native >= 0.71 provides this helper; it wires the dependencies required by the New Architecture.
  install_modules_dependencies(s)
end
