import './App.css';
import React from "react";
import { useEffect } from "react";
import { Amplify } from 'aws-amplify';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import {
  View,
  Flex,
  Alert,
  Image
} from '@aws-amplify/ui-react';

import awsexports from './aws-exports';

Amplify.configure(awsexports);

function App() {

  const [loading, setLoading] = React.useState(true);
  const [faceLivenessAnalysis, setFaceLivenessAnalysis] = React.useState(null)
  const [sessionId, setSessionId] = React.useState(null)


  const dictionary = {
    en: null,
    ar: {
      errorLabelText: 'خطأ',
      timeoutHeaderText: 'انتهى الوقت',
      timeoutMessageText:
        'لم يتناسب الوجه داخل البيضوي في الوقت المحدد. حاول مرة أخرى واملأ البيضوي بالكامل بالوجه.',
      faceDistanceHeaderText: 'تم الكشف عن حركة للأمام',
      faceDistanceMessageText: 'تجنب الاقتراب أثناء الاتصال.',
      multipleFacesHeaderText: 'تم الكشف عن عدة وجوه',
      multipleFacesMessageText:
        'تأكد من وجود وجه واحد فقط أمام الكاميرا أثناء الاتصال.',
      clientHeaderText: 'خطأ في العميل',
      clientMessageText: 'فشلت الفحص بسبب مشكلة في العميل',
      serverHeaderText: 'مشكلة في الخادم',
      serverMessageText: 'لا يمكن إكمال الفحص بسبب مشكلة في الخادم',
      landscapeHeaderText: 'الوضع الأفقي غير مدعوم',
      landscapeMessageText:
        'قم بتدوير جهازك إلى الوضع العمودي (الرأسي).',
      portraitMessageText:
        'تأكد من بقاء جهازك في الوضع العمودي (الرأسي) لمدة الفحص.',
      tryAgainText: 'حاول مرة أخرى',
      cameraMinSpecificationsHeadingText:
        'الكاميرا لا تفي بالمواصفات الدنيا',
      cameraMinSpecificationsMessageText:
          'يجب أن تدعم الكاميرا دقة لا تقل عن 320*240 و15 إطارًا في الثانية على الأقل.',
      cameraNotFoundHeadingText: 'الكاميرا غير متاحة.',
      cameraNotFoundMessageText:
          'تحقق من توصيل الكاميرا وأنه لا توجد أي تطبيقات أخرى تستخدم الكاميرا. قد تحتاج إلى الدخول إلى الإعدادات للسماح بصلاحيات الكاميرا وإغلاق جميع نوافذ المتصفح والمحاولة مرة أخرى.',
      a11yVideoLabelText: 'كاميرا ويب لفحص الحيوية',
      cancelLivenessCheckText: 'إلغاء فحص الحيوية',
      goodFitCaptionText: 'ملائم جيدًا',
      goodFitAltText:
          'الدائرةضيحي لوجه شخص يتناسب تمامًا داخل الدائرة.',
      hintCenterFaceText: 'وجهك في وسط الكاميرا',
      hintCenterFaceInstructionText:
          'التعليمات: قبل البدء بالفحص، تأكد من أن الكاميرا في أعلى وسط الشاشة ووجهك متمركز أمام الكاميرا. عند بدء الفحص، سيظهر بيضاوي في الوسط. سيُطلب منك التحرك للأمام داخل البيضاوي ثم البقاء ثابتًا. بعد الثبات لبضع ثوان، يجب أن تسمع اكتمال الفحص.',
      hintFaceOffCenterText:
          'الوجه ليس داخل البيضاوي، وجهك في وسط الكاميرا.',
      hintMoveFaceFrontOfCameraText: 'حرك وجهك أمام الكاميرا',
      hintTooManyFacesText: 'تأكد من وجود وجه واحد فقط أمام الكاميرا',
      hintFaceDetectedText: 'تم اكتشاف الوجه',
      hintCanNotIdentifyText: 'حرك وجهك أمام الكاميرا',
      hintTooCloseText: 'تراجع للخلف',
      hintTooFarText: 'اقترب أكثر',
      hintConnectingText: 'جاري الاتصال...',
      hintVerifyingText: 'جاري التحقق...',
      hintCheckCompleteText: 'اكتمال الفحص',
      hintIlluminationTooBrightText: 'انتقل إلى منطقة أقل إضاءة',
      hintIlluminationTooDarkText: 'انتقل إلى منطقة أكثر إضاءة',
      hintIlluminationNormalText: 'ظروف الإضاءة طبيعية',
      hintHoldFaceForFreshnessText: 'ثبت وجهك',
      hintMatchIndicatorText: 'اكتمل 50٪. استمر في الاقتراب.',
      photosensitivityWarningBodyText:
          'يستخدم هذا الفحص ألوان مختلفة قد تومض. كن حذرًا إذا كنت حساسًا للضوء.',
      photosensitivityWarningHeadingText: 'تحذير من الحساسية للضوء',
      photosensitivityWarningInfoText:
          'قد يعاني بعض الأشخاص من نوبات صرع عند التعرض لأضواء ملونة. كن حذرًا إذا كنت، أو أي شخص في عائلتك، تعاني من حالة صرع.',
      photosensitivityWarningLabelText: 'مزيد من المعلومات حول الحساسية للضوء',
      photosensitivyWarningBodyText:
          'يستخدم هذا الفحص ألوان مختلفة قد تومض. كن حذرًا إذا كنت حساسًا للضوء.',
      photosensitivyWarningHeadingText: 'تحذير من الحساسية للضوء',
      photosensitivyWarningInfoText:
          'قد يعاني بعض الأشخاص من نوبات صرع عند التعرض لأضواء ملونة. كن حذرًا إذا كنت، أو أي شخص في عائلتك، تعاني من حالة صرع.',
      photosensitivyWarningLabelText: 'مزيد من المعلومات حول الحساسية للضوء',
      retryCameraPermissionsText: 'أعد المحاولة',
      recordingIndicatorText: 'تسجيل',
      startScreenBeginCheckText: 'ابدأ فحص الفيديو',
      tooFarCaptionText: 'بعيد جدًا',
      tooFarAltText:
          'الدائرةضيحي لوجه شخص داخل بيضاوي؛ هناك فجوة بين حافة الوجه وحدود الدائرة.',
      waitingCameraPermissionText: 'انتظار السماح باستخدام الكاميرا.',

    },
  };


  useEffect(() => {
      const fetchCreateLiveness = async () => {
          const response = await fetch('https://73zjo7bktcczu3tov53t52lzui0meevu.lambda-url.us-east-1.on.aws/');
          const data = await response.json();
          setSessionId(data.SessionId)
          setLoading(false);
      };
      fetchCreateLiveness();

  },[])

  const handleAnalysisComplete = async () => {
      const response = await fetch('https://zdt3fnz2ipnw4aw3gpzuhyhey40mfakn.lambda-url.us-east-1.on.aws/',
          {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sessionid: sessionId })
          }

      );
      const data = await response.json();
      setFaceLivenessAnalysis(data)
  };

  return (
    <ThemeProvider>
      <Flex
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="flex-start"
        wrap="nowrap"
        gap="1rem"
      >
        <View
          as="div"
          maxHeight="600px"
          height="600px"
          width="740px"
          maxWidth="740px"
        >
          {loading ? 
            (<Loader/>):
            (
              <>
                {faceLivenessAnalysis && faceLivenessAnalysis.Confidence ? 
                (
                  <>
                    <Alert
                      variation = "info"
                      isDismissible = {false}
                      hasIcon = {true}

                    >
                      Confidence Score: {faceLivenessAnalysis.Confidence.toFixed(2)}%
                    </Alert>

                    <Alert
                      variation = "info"
                      isDismissible = {false}
                      hasIcon = {true}

                    >
                      Status: {faceLivenessAnalysis.Status}
                    </Alert>

                    <Image

                    src = {"data:image/jpeg;base64," + faceLivenessAnalysis.ReferenceImage.Bytes}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    objectPosition = "50% 50%"
                    />


                  </>
                ):
                (
                <FaceLivenessDetector
                  sessionId = {sessionId}
                  region = "us-east-1"
                  onAnalysisComplete = {handleAnalysisComplete}
                  disableStartScreen = {false}
                  onError={(error) => {
                    console.error(error);
                  }}
                  displayText={dictionary["ar"]}
                />)}
              </>
            )
          }

        </View>
      </Flex>
    </ThemeProvider>


  );
}

export default App;