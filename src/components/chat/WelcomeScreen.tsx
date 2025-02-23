import { Box, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import InfoIcon from "@mui/icons-material/Info";
import ChatIcon from "@mui/icons-material/Chat";

interface WelcomeScreenProps {
  onNewChat: () => void;
  onQuickStart: (message: string) => void;
}

const WelcomeScreen = ({ onNewChat, onQuickStart }: WelcomeScreenProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        p: 4,
        gap: 6,
        mt: -4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Medi'ye Hoş Geldiniz
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          İlaçlarınızı düzenli kullanmanıza yardımcı olan, sağlık takibinizi
          kolaylaştıran ve 7/24 yanınızda olan akıllı sağlık asistanınız. Size
          nasıl yardımcı olabilirim?
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          width: "100%",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<AccessTimeIcon />}
          onClick={() =>
            onQuickStart(
              "Günlük Coumadin 5mg ilacımı akşam 21:00'da almam gerekiyor, ReMedi'de ilaç takibi oluşturur musun?"
            )
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              İlaç Hatırlatıcısı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Günlük ilaç takibiniz için ReMedi'de hatırlatıcı oluşturun
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={() =>
            onQuickStart(
              "Coumadin ilacı hakkında detaylı bilgi alabilir miyim? Kullanım amacı, yan etkileri ve dikkat edilmesi gerekenler nelerdir?"
            )
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              İlaç Bilgileri
            </Typography>
            <Typography variant="body2" color="text.secondary">
              İlaçlarınız hakkında detaylı bilgi alın
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<LocalHospitalIcon />}
          onClick={() =>
            onQuickStart(
              "ReMedi'de sağlık değerlerimi nasıl takip edebilirim? Tansiyonum yükseldiğinde doktora başvurmam gerekir mi?"
            )
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Sağlık Takibi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sağlık değerlerinizi ReMedi'de kaydedin ve takip edin
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          startIcon={<ChatIcon />}
          onClick={() =>
            onQuickStart(
              "Medi, bugün kendimi biraz endişeli hissediyorum. Seninle biraz dertleşebilir miyiz?"
            )
          }
          sx={{
            justifyContent: "flex-start",
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Dertleşelim
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sağlık yolculuğunuzda size destek olalım
            </Typography>
          </Box>
        </Button>
      </Box>

      <Button
        variant="contained"
        startIcon={<QuestionAnswerIcon />}
        onClick={onNewChat}
        sx={{
          mt: 2,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "1.1rem",
        }}
      >
        Kendi Sorunuzu Sorun
      </Button>
    </Box>
  );
};

export default WelcomeScreen;
